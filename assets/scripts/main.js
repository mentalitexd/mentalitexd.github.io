document.addEventListener('DOMContentLoaded', function() {
    const gameIDInput = document.getElementById('gameID');
    const searchBtn = document.getElementById('searchBtn');
    const logOutput = document.getElementById('logOutput');
    
    let apiSettings = {};
    
    fetch('./assets/settings/api.json')
        .then(response => response.json())
        .then(settings => {
            apiSettings = settings;
            updateLog({
                status: "ready",
                message: "API ayarları yüklendi. Game ID girin."
            });
        })
        .catch(error => {
            updateLog({
                status: "error",
                message: "API ayarları yüklenemedi.",
                error: error.message
            });
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
            updateLog({
                status: "error",
                message: "Lütfen geçerli bir Game ID girin."
            });
            return;
        }
        
        clearLog();
        
        updateLog({
            status: "searching",
            message: "Oyun aranıyor...",
            gameID: gameID
        });
      
        makeApiRequest(gameID);
    }
    
    function makeApiRequest(gameID) {
        const apiUrl = `https://violand.dev.tc/api/manifest/${gameID}`;
        
        fetch(apiUrl)
            .then(response => {
                const statusCode = response.status;
                const isFound = statusCode === 200;
                
                if (isFound) {
                    return response.json().then(data => {
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
                }
            })
            .catch(error => {
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
            });
    }
    
    function downloadManifest(gameID) {
        updateLog({
            status: "downloading",
            message: "Manifest indiriliyor...",
            gameID: gameID
        });
        
        const downloadUrl = `https://violand.dev.tc/api/manifest/${gameID}/download`;
        
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
                
                updateLog({
                    status: "success",
                    message: `Manifest başarıyla indirildi: ${gameID}_manifest.zip`,
                    gameID: gameID
                });
            })
            .catch(error => {
                updateLog({
                    status: "error",
                    message: "Manifest indirilemedi.",
                    error: error.message,
                    gameID: gameID
                });
            });
    }
    
    function updateLog(data) {
        logOutput.textContent = JSON.stringify(data, null, 2);
    }
    
    function clearLog() {
        logOutput.textContent = '';
    }
    
    gameIDInput.addEventListener('focus', function() {
        this.parentElement.style.boxShadow = '0 0 20px rgba(0, 102, 255, 0.6)';
    });
    
    gameIDInput.addEventListener('blur', function() {
        this.parentElement.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.2)';
    });
});
