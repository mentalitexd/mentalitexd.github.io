document.addEventListener('DOMContentLoaded', function() {
    const lookupTypeSelect = document.getElementById('lookupType');
    const lookupQueryInput = document.getElementById('lookupQuery');
    const lookupBtn = document.getElementById('lookupBtn');
    const lookupResult = document.getElementById('lookupResult');
    const backBtn = document.getElementById('backBtn');
    
    backBtn.addEventListener('click', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            window.location.href = 'https://violand.dev.tc';
        }, 500);
    });
    
    lookupBtn.addEventListener('click', performLookup);
    
    lookupQueryInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performLookup();
        }
    });
    
    function performLookup() {
        const queryType = lookupTypeSelect.value;
        const queryValue = lookupQueryInput.value.trim();
        
        if (!queryValue) {
            showResult('Please enter a valid query', 'error');
            return;
        }
        
        showResult('Searching...', 'info');
        
        const apiUrl = `https://app-violand.dev.tc/api/lookup?type=${queryType}&query=${encodeURIComponent(queryValue)}`;
        
        fetch(apiUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Lookup request failed');
            })
            .then(data => {
                if (data.status === "success") {
                    if (data.data) {
                        showResult(JSON.stringify(data.data, null, 2), 'success');
                    } else if (data.raw_data) {
                        showResult(data.raw_data, 'success');
                    } else {
                        showResult('No data found', 'info');
                    }
                } else {
                    showResult(`Lookup failed: ${data.message}`, 'error');
                }
            })
            .catch(error => {
                showResult(`Lookup error: ${error.message}`, 'error');
            });
    }
    
    function showResult(message, type = 'info') {
        lookupResult.textContent = message;
        lookupResult.className = `lookup-result ${type}`;
    }
    
    lookupQueryInput.addEventListener('focus', function() {
        this.parentElement.style.boxShadow = '0 10px 40px rgba(110, 69, 226, 0.4)';
        this.parentElement.style.borderColor = 'rgba(110, 69, 226, 0.5)';
    });
    
    lookupQueryInput.addEventListener('blur', function() {
        this.parentElement.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        this.parentElement.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
});
