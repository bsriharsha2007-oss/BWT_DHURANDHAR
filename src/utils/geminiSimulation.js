import { GoogleGenAI } from '@google/genai';
import { calculateProjection } from './simulation';

function extractJsonObject(text) {
  if (!text) return null;
  // Strip common markdown code fences.
  const cleaned = String(text)
    .replace(/```json\s*/gi, '```')
    .replace(/```/g, '')
    .trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  return cleaned.slice(start, end + 1);
}

function isFiniteNumber(n) {
  return typeof n === 'number' && Number.isFinite(n);
}

function coerceInputs(input) {
  const parsed = {
    income: Number(input?.income),
    expenses: Number(input?.expenses),
    savings: Number(input?.savings),
    goal: Number(input?.goal),
    years: Number(input?.years),
    emi: Number(input?.emi),
  };

  for (const [k, v] of Object.entries(parsed)) {
    if (!isFiniteNumber(v)) {
      throw new Error(`Invalid numeric input: ${k}`);
    }
  }

  return parsed;
}

function normalizeScenarioResults(results, years) {
  const requiredKeys = ['safe', 'balanced', 'aggressive'];
  if (!results || typeof results !== 'object') return null;
  for (const k of requiredKeys) {
    if (!Array.isArray(results[k])) return null;
  }

  const expectedLen = years + 1;
  if (
    results.safe.length !== expectedLen ||
    results.balanced.length !== expectedLen ||
    results.aggressive.length !== expectedLen
  ) {
    return null;
  }

  const safe = results.safe.map((v) => Math.round(Number(v)));
  const balanced = results.balanced.map((v) => Math.round(Number(v)));
  const aggressive = results.aggressive.map((v) => Math.round(Number(v)));

  if (
    safe.some((v) => !Number.isFinite(v)) ||
    balanced.some((v) => !Number.isFinite(v)) ||
    aggressive.some((v) => !Number.isFinite(v))
  ) {
    return null;
  }

  return { safe, balanced, aggressive };
}

async function responseToText(resp) {
  try {
    if (!resp) return '';
    if (typeof resp.text === 'function') return await resp.text();
    if (typeof resp.text === 'string') return resp.text;
    if (typeof resp.response?.text === 'function') return resp.response.text();
    return JSON.stringify(resp);
  } catch {
    return '';
  }
}

/**
 * Calls the Gemini API to calculate scenario projections.
 *
 * Returns structured JSON:
 * {
 *   safe: [yearly values],
 *   balanced: [yearly values],
 *   aggressive: [yearly values]
 * }
 */
export async function runFinancialSimulation(data) {
  const { income, expenses, savings, goal, years, emi } = coerceInputs(data);

  const localFallback = () => {
    const local = calculateProjection(income, expenses, savings, goal, years, emi);
    return { safe: local.safe, balanced: local.balanced, aggressive: local.aggressive };
  };

  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    // fallback names for various environments
    import.meta.env.GEMINI_API_KEY ||
    import.meta.env.VITE_GOOGLE_API_KEY ||
    null;

  // If the API key isn't present (common in local dev), return deterministic results.
  if (!apiKey) {
    return localFallback();
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = [
      'You are a financial simulation engine.',
      '',
      'Given inputs:',
      `- monthly income: ${income}`,
      `- monthly expenses: ${expenses}`,
      `- current savings: ${savings}`,
      `- goal amount: ${goal}`,
      `- years to goal: ${years}`,
      `- monthly EMI: ${emi}`,
      '',
      'Compute yearly projections for three scenarios:',
      '- safe growth: 5% annual growth',
      '- balanced growth: 10% annual growth',
      '- aggressive growth: 18% annual growth',
      '',
      'Rules:',
      '- arrays must have length years+1',
      '- year 0 value = current savings',
      '- annual contribution = (income - expenses - emi) * 12',
      '- for each year: newValue = prevValue*(1+rate) + annualContribution',
      '- apply inflation adjustment of 6%: inflationAdjusted = newValue/(1.06)',
      '',
      'Return ONLY valid JSON with this exact shape (no markdown, no prose):',
      '{ "safe":[...], "balanced":[...], "aggressive":[...] }',
      'All values must be numbers (not strings).',
    ].join('\n');

    const respPromise = ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // Hard timeout so the UI never hangs waiting for Gemini.
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini simulation timeout')), 8000),
    );

    const resp = await Promise.race([respPromise, timeoutPromise]);

    const text = await responseToText(resp);
    const json = extractJsonObject(text);
    const parsed = json ? JSON.parse(json) : null;
    const normalized = normalizeScenarioResults(parsed, years);
    if (!normalized) {
      throw new Error('Gemini returned unexpected response shape');
    }
    return normalized;
  } catch (err) {
    console.warn('[Gemini] runFinancialSimulation failed, using local engine.', err);
    return localFallback();
  }
}

/**
 * Backwards-compatible helper used by existing UI code.
 * Returns the full projection object the dashboard expects.
 */
export async function runGeminiSimulation(financialData) {
  const { income, expenses, savings, goal, years, emi } = coerceInputs(financialData);
  const { safe, balanced, aggressive } = await runFinancialSimulation({
    income,
    expenses,
    savings,
    goal,
    years,
    emi,
  });

  return {
    years: Array.from({ length: years + 1 }, (_, i) => i),
    safe,
    balanced,
    aggressive,
    goalLine: Array.from({ length: years + 1 }, () => goal),
  };
}

/**
 * Ask Gemini for an overall opinion on the user's situation.
 * Returns: { summary: string, riskLevel: 'low'|'medium'|'high', recommendations: string[] }
 */
export async function runGeminiOpinion({ formData, projectionData, requestId }) {
  const { income, expenses, savings, goal, years, emi } = coerceInputs(formData ?? {});
  const lastBalanced =
    Array.isArray(projectionData?.balanced) && projectionData.balanced.length
      ? projectionData.balanced[projectionData.balanced.length - 1]
      : null;
  const lastAggressive =
    Array.isArray(projectionData?.aggressive) && projectionData.aggressive.length
      ? projectionData.aggressive[projectionData.aggressive.length - 1]
      : null;

  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.GEMINI_API_KEY ||
    import.meta.env.VITE_GOOGLE_API_KEY ||
    null;

  if (!apiKey) {
    console.warn('[Gemini] No API key configured for opinion. Set VITE_GEMINI_API_KEY.');
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = [
      'You are a helpful personal finance coach for an Indian user.',
      'Write a personalized assessment that MUST reference the user’s actual numbers and projections.',
      'Do NOT repeat generic boilerplate. Be specific and grounded.',
      '',
      `RequestId: ${requestId ?? 'none'} (use this to ensure the wording is unique each run)`,
      `Today: ${new Date().toISOString()}`,
      '',
      'Inputs:',
      `- monthly income: ${income}`,
      `- monthly expenses: ${expenses}`,
      `- current savings: ${savings}`,
      `- monthly EMI: ${emi}`,
      `- goal amount: ${goal}`,
      `- years to goal: ${years}`,
      '',
      'Projection snapshots (inflation adjusted):',
      `- final balanced projection: ${lastBalanced}`,
      `- final aggressive projection: ${lastAggressive}`,
      '',
      'Decide a single overall riskLevel: "low", "medium", or "high".',
      'ALWAYS provide 4-6 specific, actionable recommendations, even if the user is doing well.',
      'If the user is doing well, recommendations should focus on optimizing (tax efficiency, emergency fund, increasing SIP, rebalancing, goal tracking).',
      'If the user is doing poorly, recommendations should focus on stabilizing (cutting expenses, debt strategy, increasing savings rate).',
      'Use INR context and practical India-relevant framing when helpful (SIP, emergency fund, debt-to-income).',
      'Return ONLY compact JSON with this exact shape (no prose, no markdown):',
      '{',
      '  "summary": "one or two sentence overview",',
      '  "riskLevel": "low" | "medium" | "high",',
      '  "recommendations": ["short actionable bullet", "..."]',
      '}',
    ].join('\n');

    const respPromise = ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, topP: 0.9 },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini opinion timeout')), 6000),
    );

    const resp = await Promise.race([respPromise, timeoutPromise]);

    const text = await responseToText(resp);
    const json = extractJsonObject(text);
    const parsed = json ? JSON.parse(json) : null;

    if (
      !parsed ||
      typeof parsed.summary !== 'string' ||
      !['low', 'medium', 'high'].includes(parsed.riskLevel) ||
      !Array.isArray(parsed.recommendations)
    ) {
      throw new Error('Gemini opinion returned unexpected shape');
    }

    return {
      summary: parsed.summary,
      riskLevel: parsed.riskLevel,
      recommendations: parsed.recommendations.map(String),
    };
  } catch (err) {
    console.warn('[Gemini] runGeminiOpinion failed.', err);
    return null;
  }
}

