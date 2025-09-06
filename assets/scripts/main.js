document.addEventListener('DOMContentLoaded', function() {
    const gameIDInput = document.getElementById('gameID');
    const searchBtn = document.getElementById('searchBtn');
    const logOutput = document.getElementById('logOutput');

    let allLogs = [];
    
    let shiftPressed = false;
    
    let apiSettings = {};
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Shift') {
            shiftPressed = true;
        }
        if (e.key === 'F12' && shiftPressed) {
            e.preventDefault();
            openDevTools();
        }
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            viewSource();
        }
    });
    
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Shift') {
            shiftPressed = false;
        }
    });
    
    function openDevTools() {
        addLog("Developer Tools açıldı (Özel erişim)", "info");
    }
    
    function viewSource() {
        addLog("Sayfa kaynağı görüntülendi", "info");
    }
    
    fetch('./assets/settings/api.json')
        .then(response => response.json())
        .then(settings => {
            apiSettings = settings;
            addLog("API ayarları yüklendi. Game ID girin.", "success");
            addSeparator();
        })
        .catch(error => {
            addLog("API ayarları yüklenemedi: " + error.message, "error");
            addSeparator();
        });
    
    searchBtn.addEventListener('click', searchGame);
    
    gameIDInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchGame();
        }
    });
    
    function searchGame() {
        const gameID = gameIDInput.value.trim();
        
        if (!gameID) {
            addLog("Lütfen geçerli bir Game ID girin.", "error");
            addSeparator();
            return;
        }
        
        addSeparator();
        addLog(`Oyun aranıyor: ${gameID}`, "info");
        
        makeApiRequest(gameID);
    }
    
    function makeApiRequest(gameID) {
        const apiUrl = `https://app-violand.dev.tc/api/manifest/${gameID}`;
        
        addLog(`API isteği gönderiliyor: ${apiUrl}`, "info");
        
        fetch(apiUrl)
            .then(response => {
                const statusCode = response.status;
                const isFound = statusCode === 200;
                
                if (isFound) {
                    return response.json().then(data => {
                        addLog("Oyun bulundu! Manifest hazırlanıyor...", "success");
                        
                        const result = {
                            status: "ok",
                            log: {
                                gameID: gameID,
                                founded: true,
                                status_code: statusCode,
                                data: data
                            }
                        };
                        
                        updateLog(result);
                        downloadManifest(gameID);
                    });
                } else {
                    addLog(`Oyun bulunamadı. Hata kodu: ${statusCode}`, "error");
                    
                    const result = {
                        status: "error",
                        log: {
                            gameID: gameID,
                            founded: false,
                            status_code: statusCode,
                            message: "Oyun bulunamadı"
                        }
                    };
                    
                    updateLog(result);
                    addSeparator();
                }
            })
            .catch(error => {
                addLog(`API isteği hatası: ${error.message}`, "error");
                
                const result = {
                    status: "error",
                    log: {
                        gameID: gameID,
                        founded: false,
                        status_code: 0,
                        error: error.message
                    }
                };
                
                updateLog(result);
                addSeparator();
            });
    }
    
    function downloadManifest(gameID) {
        addLog("Manifest indiriliyor...", "info");

        const downloadUrl = `https://app-violand.dev.tc/api/manifest/${gameID}/download`;
        
        fetch(downloadUrl)
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('Manifest indirilemedi.');
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `${gameID}_manifest.zip`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                
                addLog(`Manifest başarıyla indirildi: ${gameID}_manifest.zip`, "success");
                addSeparator();
            })
            .catch(error => {
                addLog(`Manifest indirme hatası: ${error.message}`, "error");
                addSeparator();
            });
    }
    
    function updateLog(data) {
        allLogs.push({
            type: "json",
            data: data,
            timestamp: new Date().toLocaleTimeString()
        });
        
        renderAllLogs();
    }
    
    function addLog(message, type = "info") {
        const timestamp = new Date().toLocaleTimeString();
        
        allLogs.push({
            type: "message",
            message: message,
            logType: type,
            timestamp: timestamp
        });
        
        renderAllLogs();
    }
    
    function addSeparator() {
        allLogs.push({
            type: "separator"
        });
        
        renderAllLogs();
    }
    
    function renderAllLogs() {
        logOutput.innerHTML = '';
        
        allLogs.forEach(log => {
            if (log.type === "message") {
                const logEntry = document.createElement('div');
                logEntry.className = `log-${log.logType}`;
                logEntry.textContent = `[${log.timestamp}] ${log.message}`;
                logOutput.appendChild(logEntry);
            } 
            else if (log.type === "json") {
                const jsonEntry = document.createElement('pre');
                jsonEntry.className = 'log-json';
                jsonEntry.textContent = JSON.stringify(log.data, null, 2);
                logOutput.appendChild(jsonEntry);
            }
            else if (log.type === "separator") {
                const separator = document.createElement('div');
                separator.className = 'log-separator';
                separator.textContent = '========================================';
                logOutput.appendChild(separator);
            }
        });
        
        logOutput.scrollTop = logOutput.scrollHeight;
    }
    
    function clearLog() {
        logOutput.innerHTML = '';
        addLog("Loglar temizlendi (sadece görsel)", "info");
        addSeparator();
    }

    gameIDInput.addEventListener('focus', function() {
        this.parentElement.style.boxShadow = '0 0 30px rgba(0, 204, 255, 0.6)';
        this.parentElement.style.transform = 'translateY(-3px)';
    });
    
    gameIDInput.addEventListener('blur', function() {
        this.parentElement.style.boxShadow = '0 0 25px rgba(102, 0, 255, 0.3)';
        this.parentElement.style.transform = 'translateY(0)';
    });

    addSeparator();
});
