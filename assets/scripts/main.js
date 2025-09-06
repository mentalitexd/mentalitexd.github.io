document.addEventListener('DOMContentLoaded', function() {
    const gameIDInput = document.getElementById('gameID');
    const searchBtn = document.getElementById('searchBtn');
    const logOutput = document.getElementById('logOutput');
    
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
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
            addLog('Lütfen Oyun ID Girin!', 'error');
            return;
        }
        
        addLog(`Oyun Manifesti Aranıyor: ${gameID}`, 'info');
        
        makeApiRequest(gameID);
    }
    
    function makeApiRequest(gameID) {
        const apiUrl = `https://app-violand.dev.tc/api/manifest/${gameID}`;
        
        fetch(apiUrl)
            .then(response => {
                const statusCode = response.status;
                
                if (statusCode === 200) {
                    addLog(`Oyun ID ${gameID} bulundu`, 'success');
                    downloadManifest(gameID);
                } else {
                    addLog(`Oyun ID ${gameID} Bulunamadı (Error: ${statusCode})`, 'error');
                }
            })
            .catch(error => {
                addLog(`API istek başarısız: ${error.message}`, 'error');
            });
    }
    
    function downloadManifest(gameID) {
        addLog(`${gameID} Oyun manifesti indiriliyor`, 'info');
        
        const downloadUrl = `https://app-violand.dev.tc/api/manifest/${gameID}/download`;
        
        fetch(downloadUrl)
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('Manifest indirme başarısız');
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
                
                addLog(`Manifest başarıyla indirildi: ${gameID}_manifest.zip`, 'success');
            })
            .catch(error => {
                addLog(`İndirme hatası: ${error.message}`, 'error');
            });
    }
    
    function addLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        logOutput.appendChild(logEntry);
        
        logOutput.scrollTop = logOutput.scrollHeight;
    }
    
    gameIDInput.addEventListener('focus', function() {
        this.parentElement.style.boxShadow = '0 0 30px rgba(255, 0, 204, 0.6)';
        this.parentElement.style.transform = 'translateY(-3px)';
    });
    
    gameIDInput.addEventListener('blur', function() {
        this.parentElement.style.boxShadow = '0 0 20px rgba(0, 204, 255, 0.4)';
        this.parentElement.style.transform = 'translateY(0)';
    });

});
