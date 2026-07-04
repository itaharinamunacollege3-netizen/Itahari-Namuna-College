import { useState, useEffect } from 'react';
import PageBanner from '../../../components/common/PageBanner';
import AnimatedSection from '../../../components/animations/AnimatedSection';
import { getPublishedSessions, lookupResult } from '../services/resultService';
import { Search, Loader2, CheckCircle2, XCircle, FileText, Download } from 'lucide-react';

export default function ExamResultsPage() {
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [symbolNumber, setSymbolNumber] = useState('');
  
  const [loadingResult, setLoadingResult] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSessions() {
      try {
        const data = await getPublishedSessions();
        setSessions(data);
        if (data.length > 0) {
          setSelectedSessionId(data[0].id);
        }
      } catch (err) {
        console.error("Error loading sessions", err);
      } finally {
        setLoadingSessions(false);
      }
    }
    loadSessions();
  }, []);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!selectedSessionId || !symbolNumber.trim()) return;
    
    setLoadingResult(true);
    setResult(null);
    setError('');

    try {
      const data = await lookupResult(selectedSessionId, symbolNumber.trim());
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingResult(false);
    }
  };

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <PageBanner 
        title="Exam Results" 
        subtitle="Check your final examination and entrance test results." 
      />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <AnimatedSection>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-stone-100">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-6 text-center">Result Lookup</h2>
              
              <form onSubmit={handleLookup} className="space-y-5 max-w-xl mx-auto">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Select Exam Session</label>
                  {loadingSessions ? (
                    <div className="animate-pulse h-12 bg-stone-200 rounded-xl w-full"></div>
                  ) : (
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none bg-stone-50"
                      value={selectedSessionId}
                      onChange={(e) => setSelectedSessionId(e.target.value)}
                      required
                    >
                      <option value="" disabled>-- Select an exam session --</option>
                      {sessions.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.examName} ({s.program})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Symbol Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none bg-stone-50"
                      placeholder="Enter your exact symbol number"
                      value={symbolNumber}
                      onChange={(e) => setSymbolNumber(e.target.value)}
                      required
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loadingResult || !selectedSessionId || !symbolNumber.trim()}
                  className="w-full py-3.5 px-6 rounded-xl bg-brand-primary hover:bg-brand-dark text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-md shadow-brand-primary/20"
                >
                  {loadingResult ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Checking Result...
                    </>
                  ) : (
                    'Check Result'
                  )}
                </button>
              </form>
            </div>
          </div>
        </AnimatedSection>

        {error && (
          <AnimatedSection animation="slide-up">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl max-w-xl mx-auto shadow-sm">
              <div className="flex gap-3 items-start">
                <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800">Lookup Failed</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {result && (
          <AnimatedSection animation="slide-up">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-100 max-w-2xl mx-auto mt-8">
              <div className={`p-6 text-white flex items-center gap-4 ${
                result.status === 'PASS' ? 'bg-emerald-600' : 
                result.status === 'FAIL' ? 'bg-rose-600' : 'bg-amber-500'
              }`}>
                {result.status === 'PASS' ? <CheckCircle2 className="w-12 h-12 opacity-90" /> : <XCircle className="w-12 h-12 opacity-90" />}
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {result.status === 'PASS' ? 'Congratulations!' : 
                     result.status === 'FAIL' ? 'Result: Fail' : 'Result: Absent'}
                  </h3>
                  <p className="text-white/90 text-sm mt-1">{result.examName}</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <p className="text-sm text-stone-500 font-medium uppercase tracking-wider mb-1">Student Name</p>
                    <p className="font-semibold text-lg text-stone-900">{result.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500 font-medium uppercase tracking-wider mb-1">Symbol Number</p>
                    <p className="font-semibold text-lg text-stone-900">{result.symbolNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500 font-medium uppercase tracking-wider mb-1">Program</p>
                    <p className="font-semibold text-lg text-stone-900">{result.program}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500 font-medium uppercase tracking-wider mb-1">Marks Obtained</p>
                    <p className="font-semibold text-lg text-stone-900">
                      {result.obtainedMarks} <span className="text-sm text-stone-400 font-normal">/ {result.totalMarks}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-500 text-sm">
                    <FileText className="w-4 h-4" />
                    Official Result Record
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-stone-500 font-medium">Percentage</p>
                    <p className="text-2xl font-bold text-stone-900">{result.percentage}%</p>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Save / Print Slip
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
