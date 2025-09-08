document.addEventListener('DOMContentLoaded', function() {
    const gameIDInput = document.getElementById('gameID');
    const searchBtn = document.getElementById('searchBtn');
    const logOutput = document.getElementById('logOutput');
    const backBtn = document.getElementById('backBtn');
    
    let apiSettings = {};
    
    fetch('./assets/settings/api.json')
        .then(response => response.json())
        .then(settings => {
            apiSettings = settings;
        })
        .catch(error => {
        });
    
    searchBtn.addEventListener('click', searchGame);
    
    gameIDInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchGame();
        }
    });
    
    backBtn.addEventListener('click', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            window.location.href = 'https://violand.dev.tc';
        }, 500);
    });
    
    function searchGame() {
        const gameID = gameIDInput.value.trim();
        
        if (!gameID) {
            addLog('Please enter a valid Game ID', 'error');
            return;
        }
        
        addLog(`Searching for Game ID: ${gameID}`, 'info');
        
        makeApiRequest(gameID);
    }
    
    function makeApiRequest(gameID) {
        const apiUrl = `https://app-violand.dev.tc/api/manifest/${gameID}`;
        
        fetch(apiUrl)
            .then(response => {
                const statusCode = response.status;
                
                if (statusCode === 200) {
                    addLog(`Game ID ${gameID} found`, 'success');
                    downloadManifest(gameID);
                } else {
                    addLog(`Game ID ${gameID} not found (Error: ${statusCode})`, 'error');
                }
            })
            .catch(error => {
                addLog(`API request failed: ${error.message}`, 'error');
            });
    }
    
    function downloadManifest(gameID) {
        addLog(`Downloading manifest for Game ID: ${gameID}`, 'info');
        
        const downloadUrl = `https://app-violand.dev.tc/api/manifest/${gameID}/download`;
        
        fetch(downloadUrl)
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('Manifest download failed');
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
                
                addLog(`Manifest downloaded successfully: ${gameID}_manifest.zip`, 'success');
            })
            .catch(error => {
                addLog(`Download failed: ${error.message}`, 'error');
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
        this.parentElement.style.boxShadow = '0 10px 40px rgba(110, 69, 226, 0.4)';
        this.parentElement.style.borderColor = 'rgba(110, 69, 226, 0.5)';
    });
    
    gameIDInput.addEventListener('blur', function() {
        this.parentElement.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        this.parentElement.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
});
