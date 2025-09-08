document.addEventListener('DOMContentLoaded', function() {
    const lookupType = document.getElementById('lookupType');
    const lookupQuery = document.getElementById('lookupQuery');
    const lookupBtn = document.getElementById('lookupBtn');
    const resultsOutput = document.getElementById('resultsOutput');
    const backBtn = document.getElementById('backBtn');
    
    backBtn.addEventListener('click', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            window.location.href = 'https://violand.dev.tc';
        }, 500);
    });
    
    lookupBtn.addEventListener('click', function() {
        const type = lookupType.value;
        const query = lookupQuery.value.trim();
        
        if (!query) {
            showResult('error', 'Please enter a search query');
            return;
        }
        
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        this.disabled = true;
        
        performLookup(type, query);
    });
    
    lookupQuery.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            lookupBtn.click();
        }
    });
    
    function performLookup(type, query) {
        fetch('https://app-violand.dev.tc/api/lookup', {
            method: 'POST',
            body: JSON.stringify({
                type: type,
                query: query
            })
        })
        .then(response => response.json())
        .then(data => {
            lookupBtn.innerHTML = '<i class="fas fa-search"></i> Search';
            lookupBtn.disabled = false;
            
            if (data.status === 'success') {
                showResult('success', type, query, data);
            } else {
                showResult('error', data.message || 'Lookup failed');
            }
        })
        .catch(error => {
            lookupBtn.innerHTML = '<i class="fas fa-search"></i> Search';
            lookupBtn.disabled = false;
            
            showResult('error', 'Network error: ' + error.message);
        });
    }
    
    function showResult(type, message, query = null, data = null) {
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${type}`;
        
        if (type === 'success') {
            resultItem.innerHTML = `
                <div class="result-header">
                    <span class="result-type">${data.type.toUpperCase()}</span>
                    <span class="result-query">${data.query}</span>
                </div>
                <div class="result-data">
                    <pre>${formatResultData(data)}</pre>
                </div>
            `;
        } else {
            resultItem.innerHTML = `
                <div class="result-header">
                    <span class="result-type">ERROR</span>
                </div>
                <div class="result-data">
                    <pre>${message}</pre>
                </div>
            `;
        }
        
        resultsOutput.appendChild(resultItem);
        
        resultsOutput.scrollTop = resultsOutput.scrollHeight;
        
        const noResults = resultsOutput.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }
    }
    
    function formatResultData(data) {
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            return data.data.map(item => {
                if (typeof item === 'object') {
                    return Object.entries(item)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\n');
                }
                return String(item);
            }).join('\n\n');
        } else if (data.raw_data) {
            return data.raw_data;
        } else {
            return 'No data found';
        }
    }
});
