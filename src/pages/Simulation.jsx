import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import InputForm from '../components/InputForm';
import Dashboard from '../components/Dashboard';
import { calculateProjection } from '../utils/simulation';
import { runGeminiOpinion } from '../utils/geminiSimulation';

export default function Simulation() {
  const [formData, setFormData] = useState(null);

  const [includeEMI, setIncludeEMI] = useState(true);
  const [projectionData, setProjectionData] = useState(null);
  const [aiOpinion, setAiOpinion] = useState(null);
  const [aiRequestId, setAiRequestId] = useState(null);

  const handleSimulationComplete = async ({ formData: submittedFormData, projectionResults }) => {
    setFormData(submittedFormData);
    setProjectionData(projectionResults);
    setAiOpinion(null);
    const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setAiRequestId(requestId);

    try {
      const opinion = await runGeminiOpinion({
        formData: submittedFormData,
        projectionData: projectionResults,
        requestId,
      });
      setAiOpinion(opinion);
    } catch (e) {
      console.warn('Gemini opinion failed', e);
    }
  };

  const toggleEMI = () => {
    const newIncludeEMI = !includeEMI;
    setIncludeEMI(newIncludeEMI);
    
    // If we already have projection data, recalculate it immediately locally
    if (projectionData && formData) {
      const currentEMI = newIncludeEMI ? formData.emi : 0;
      const res = calculateProjection(
        formData.income,
        formData.expenses,
        formData.savings,
        formData.goal,
        formData.years,
        currentEMI
      );
      setProjectionData(res);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-4 space-y-8">
            <InputForm 
              onSimulationComplete={handleSimulationComplete} 
              initialData={formData ?? undefined}
            />
            
            {/* Decision Simulator Toggle */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-zinc-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-100 rounded-lg">
                    <Activity className="w-5 h-5 text-zinc-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900">Decision Simulator</h3>
                    <p className="text-xs text-zinc-500">Toggle EMI impact</p>
                  </div>
                </div>
                <button
                  onClick={toggleEMI}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    includeEMI ? 'bg-emerald-600' : 'bg-zinc-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      includeEMI ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dashboard */}
          <div className="lg:col-span-8">
            {projectionData ? (
              <Dashboard 
                formData={{...(formData ?? {}), emi: includeEMI ? (formData?.emi ?? 0) : 0}} 
                projectionData={projectionData}
                aiOpinion={aiOpinion}
                aiRequestId={aiRequestId}
              />
            ) : (
              <div className="bg-white p-12 rounded-3xl shadow-xl border border-zinc-100 flex flex-col items-center justify-center text-center h-[600px]">
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                  <Activity className="w-10 h-10 text-zinc-300" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Ready for Simulation</h3>
                <p className="text-zinc-500 max-w-xs">
                  Adjust your financial parameters on the left and click "Run Simulation" to see your digital twin's future.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
