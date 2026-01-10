import React, { useState } from 'react';
import { X, Sparkles, Loader2, Copy, Check, AlertCircle } from 'lucide-react';

interface AIProtocolModalProps {
  patientName: string;
  onClose: () => void;
}

export const AIProtocolModal: React.FC<AIProtocolModalProps> = ({ patientName, onClose }) => {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const protocolTemplates: Record<string, string> = {
    'weight loss': `## Recommended Protocol: Weight Management

### Primary Compounds

**1. Tirzepatide** (GLP-1/GIP Dual Agonist)
- **Dosage:** Start at 2.5mg, titrate to 5mg after 4 weeks
- **Frequency:** Once weekly (same day each week)
- **Route:** Subcutaneous injection
- **Duration:** 12 weeks initial course

**2. BPC-157** (Body Protection Compound)
- **Dosage:** 250mcg twice daily
- **Frequency:** Morning and evening
- **Route:** Subcutaneous injection
- **Duration:** 8 weeks

### Protocol Schedule

| Day | Morning | Evening |
|-----|---------|---------|
| Mon-Sat | BPC-157 250mcg | BPC-157 250mcg |
| Sunday | Tirzepatide 5mg + BPC-157 250mcg | BPC-157 250mcg |

### Monitoring Requirements
- Weekly weigh-ins
- Monthly metabolic panel
- Bi-weekly check-ins via patient app

### Expected Outcomes
- 10-15% body weight reduction over 12 weeks
- Improved metabolic markers
- Enhanced recovery and tissue health`,

    'joint recovery': `## Recommended Protocol: Joint Recovery & Healing

### Primary Compounds

**1. BPC-157** (Body Protection Compound)
- **Dosage:** 500mcg daily
- **Frequency:** Once daily, morning
- **Route:** Subcutaneous injection near affected area
- **Duration:** 8-12 weeks

**2. TB-500** (Thymosin Beta-4)
- **Dosage:** 2.5mg twice weekly
- **Frequency:** Monday and Thursday
- **Route:** Subcutaneous injection
- **Duration:** 6-8 weeks loading, then maintenance

### Protocol Schedule

| Week | BPC-157 | TB-500 |
|------|---------|--------|
| 1-4 | 500mcg daily | 2.5mg 2x/week |
| 5-8 | 500mcg daily | 2.5mg 1x/week |
| 9-12 | 250mcg daily | As needed |

### Monitoring Requirements
- Pain scale tracking daily
- Range of motion assessment bi-weekly
- Progress photos monthly

### Expected Outcomes
- Significant reduction in joint pain
- Improved flexibility and range of motion
- Accelerated tissue healing`,

    default: `## Recommended Protocol: Comprehensive Health Optimization

### Primary Compounds

**1. BPC-157** (Body Protection Compound)
- **Dosage:** 500mcg daily
- **Frequency:** Once daily
- **Route:** Subcutaneous injection
- **Duration:** 8 weeks

**2. Semaglutide** (GLP-1 Agonist)
- **Dosage:** Start 0.25mg, titrate to 0.5mg
- **Frequency:** Once weekly
- **Route:** Subcutaneous injection
- **Duration:** 12 weeks

**3. Ipamorelin** (Growth Hormone Secretagogue)
- **Dosage:** 200mcg daily
- **Frequency:** Before bed, on empty stomach
- **Route:** Subcutaneous injection
- **Duration:** 12 weeks

### Protocol Schedule

| Time | Compound | Dosage |
|------|----------|--------|
| Morning | BPC-157 | 500mcg |
| Weekly (Sun) | Semaglutide | 0.5mg |
| Bedtime | Ipamorelin | 200mcg |

### Monitoring Requirements
- Weekly adherence check-ins
- Monthly labs (metabolic panel, IGF-1)
- Bi-weekly progress assessment

### Expected Outcomes
- Improved body composition
- Enhanced recovery and sleep quality
- Optimized metabolic function`,
  };

  const generateProtocol = () => {
    if (!goal.trim()) return;

    setIsLoading(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      const lowerGoal = goal.toLowerCase();
      let selectedProtocol = protocolTemplates.default;

      if (lowerGoal.includes('weight') || lowerGoal.includes('fat') || lowerGoal.includes('metabolic')) {
        selectedProtocol = protocolTemplates['weight loss'];
      } else if (
        lowerGoal.includes('joint') ||
        lowerGoal.includes('recovery') ||
        lowerGoal.includes('heal') ||
        lowerGoal.includes('injury')
      ) {
        selectedProtocol = protocolTemplates['joint recovery'];
      }

      setResult(selectedProtocol);
      setIsLoading(false);
    }, 2000);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Protocol Assistant</h2>
              <p className="text-sm text-slate-500">Generating protocol for {patientName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Treatment Goals
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Describe the patient's goals (e.g., 'Weight loss and joint recovery for an active 45-year-old male')"
              className="w-full h-28 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateProtocol}
            disabled={!goal.trim() || isLoading}
            className="w-full py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Protocol...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Protocol
              </>
            )}
          </button>

          {/* Result Section */}
          {result && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">Generated Protocol</h3>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 prose prose-sm max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-800 prose-li:text-slate-600">
                <div className="whitespace-pre-wrap font-mono text-sm">
                  {result.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) {
                      return (
                        <h2 key={i} className="text-xl font-bold text-slate-900 mt-0 mb-4">
                          {line.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (line.startsWith('### ')) {
                      return (
                        <h3 key={i} className="text-lg font-semibold text-slate-800 mt-6 mb-3">
                          {line.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (line.startsWith('**') && line.includes('**')) {
                      const parts = line.split('**');
                      return (
                        <p key={i} className="my-2">
                          <strong className="text-slate-800">{parts[1]}</strong>
                          {parts[2]}
                        </p>
                      );
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <p key={i} className="my-1 ml-4 text-slate-600">
                          {line}
                        </p>
                      );
                    }
                    if (line.startsWith('|')) {
                      return (
                        <p key={i} className="my-1 text-slate-600 font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                          {line}
                        </p>
                      );
                    }
                    return line.trim() ? (
                      <p key={i} className="my-2 text-slate-600">
                        {line}
                      </p>
                    ) : (
                      <br key={i} />
                    );
                  })}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Clinical Review Required</p>
                  <p className="text-sm text-amber-700 mt-1">
                    This AI-generated protocol is a starting point and must be reviewed and adjusted
                    based on the patient's complete medical history, contraindications, and clinical judgment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
