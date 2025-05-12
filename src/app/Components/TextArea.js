import { Paperclip, Send, X } from 'lucide-react';

export function TextArea({ 
    pdfFile, 
    setPdfFile, 
    isLoginSuccessful, 
    analyzePdf, 
    analyzePdfNoLogin, 
    textareaRef, 
    question,
    setQuestion,
    fileInputRef,
    chatHistory,
    loading
    }) {
    return(
        <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-1 shadow-lg">
                            {pdfFile && (
                                <p className="flex gap-5 items-center text-sm text-gray-600 mt-2 mb-4 ml-3 truncate mb-2">
                                {pdfFile.name}
                                <X className='w-4' 
                                    onClick={() => {
                                        setPdfFile(null);
                                        if(fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                />
                                </p>
                            )}
                            <form onSubmit={isLoginSuccessful ? analyzePdf : analyzePdfNoLogin}>
                                <div className="flex items-end">
                                    <div className="flex-grow flex items-center bg-gray-700/50 rounded-lg pr-2">
                                        <textarea
                                            ref={textareaRef}
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            placeholder="Message Tusk AI..."
                                            className="w-full bg-transparent text-white focus:outline-none resize-none max-h-50 py-3 px-4"
                                            rows={1}
                                        />
                                        <input ref={fileInputRef} id='file-upload' type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} hidden required/>
                                        <label htmlFor="file-upload" className="cursor-pointer p-2 text-gray-400 hover:text-purple-400 transition-colors">
                                        <Paperclip className="w-5 h-5" />
                                        </label>
                                    </div>
                                    
                                    <button type='submit'
                                        className={`ml-2 p-3 rounded-lg ${chatHistory ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 cursor-not-allowed'} transition-colors`}
                                        disabled={loading}
                                    >
                                        <Send className="w-5 h-5 text-white" />
                                    </button>
                                        
                                    
                                </div>
                            </form>
                            <p className="text-xs text-gray-500 mt-2 px-2">
                                Tusk AI may produce inaccurate information. Consider verifying important details.
                            </p>
                        </div>
    );
}