var time = document.getElementById("time");
    var actionButton = document.getElementById("actionButton");
    var pauseButton = document.getElementById("pauseButton");
    var changeModeButton = document.getElementById("changeModeButton");
    var alarmButton = document.getElementById("alarmButton");
    var addAlarmButton = document.getElementById("addAlarmButton");
    var alarms = document.getElementById("alarms");
    var existingAlarms = document.getElementById("existingAlarms");
    var registry = document.getElementById("registry");
    var actionsRegistry = document.getElementById("actionsRegistry");
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    var timerS = 0;
    var timerM = 0;
    var timerMS = 0;
    var alarmsArr = [];
    var registryArr = [];
    var loop;
    var buttons = document.getElementsByClassName('button')
    var titleRegistry = document.getElementById('title-registry');

    function startTimer() {
        registryArr.push('Tempo iniciado.')
        refreshRegistryList();
        pauseButton.classList.remove('hidden')
        actionButton.childNodes.forEach(node => {
            if (node.nodeName == '#text') {
                node.textContent = "Parar cronômetro";
            }
            if (node.nodeName == 'IMG') {
                node.src = 'close.png';
            }
        })  
        time.classList.remove('running', 'reset', 'pause')
        time.classList.add('running')
        startLoop();
    }

    function restartTimer() {
        registryArr.push('Tempo reiniciado.')
        refreshRegistryList();
        time.classList.remove('running', 'reset', 'pause')
        time.classList.add('running');
        pauseButton.childNodes.forEach(node => {
            if (node.nodeName == '#text') {
                node.textContent = "Pausar cronômetro";
            }
            if (node.nodeName == 'IMG') {
                node.src = 'pause.png';
            }
        })  
        startLoop();
    }

    function pauseTimer() {
        registryArr.push(`Tempo pausado às ${time.innerHTML}.`)
        refreshRegistryList();
        time.classList.remove('running', 'reset', 'pause')
        time.classList.add('pause')
        document.getElementById("pauseAudio").play();
        saveTimer();
        pauseButton.childNodes.forEach(node => {
            if (node.nodeName == '#text') {
                node.textContent = "Retomar cronômetro";
            }
            if (node.nodeName == 'IMG') {
                node.src = 'play.png';
            }
        })  
        clearInterval(loop);
    }

    function formatTime(value, length = 2) {
        return value.toString().padStart(length, '0');
    }

    function saveTimer() {
        localStorage.setItem('timerS', timerS)
        localStorage.setItem('timerMS', timerMS)
        localStorage.setItem('timerM', timerM)
    }

    function stopTimer() {
        registryArr = [];
        refreshRegistryList();
        time.classList.remove('running', 'reset', 'pause')
        time.classList.add('reset')
        pauseButton.classList.add('hidden')
        pauseButton.childNodes.forEach(node => {
            if (node.nodeName == '#text') {
                node.textContent = "Pausar cronômetro";
            }
            if (node.nodeName == 'IMG') {
                node.src = 'pause.png';
            }
        })  
        document.getElementById("resetAudio").play();
        actionButton.childNodes.forEach(node => {
            if (node.nodeName == '#text') {
                node.textContent = "Iniciar cronômetro";
            }
            if (node.nodeName == 'IMG') {
                node.src = 'play.png';
            }
        })   
        clearInterval(loop);
        resetTimer();
        refreshTimer();
        saveTimer();
    }

    function resetTimer() {
        timerS = 0;
        timerM = 0;
        timerMS = 0;
    }

    function startLoop() {
        loop = setInterval(() => {
            timerMS += 10;
            refreshTimer();
        }, 10)
    }

    function refreshTimer() {
        time.innerHTML = `${formatTime(timerM)}:${formatTime(timerS)}:${formatTime(timerMS, 3)}`;

        if (timerS == 60) {
            timerS = 0;
            timerM++;
            refreshTimer();
            document.getElementById("sucessAudio").play();
        } 

        if (timerMS == 1000) {
            timerS++;
            timerMS = 0;
            refreshTimer();
        }

        refreshAlarmsList();
        refreshRegistryList();

        alarmsArr.forEach(alarm => {
            if (alarm == time.innerHTML) {
                alarmsArr.splice(alarmsArr.indexOf(alarm), 1);
                registryArr.push(`Alarme tocado às ${time.innerHTML}.`)
                refreshRegistryList();
                time.classList.remove('running', 'reset', 'pause')
                time.classList.add('pause')
                document.getElementById("alarmAudio").play();
                saveTimer();
                pauseButton.innerHTML = "Retornar cronômetro";
                clearInterval(loop);
            }
        });
    }   

    function lightMode() {
        changeModeButton.childNodes.forEach(node => {
            if (node.nodeName == 'IMG') {
                node.src = 'moon.png';
            }
            if (node.nodeName == '#text') {
                node.textContent = "Modo Escuro";
            }
        }) 
        r.style.setProperty('--back', 'rgb(211, 211, 240)');
        r.style.setProperty('--text', 'black');
        r.style.setProperty('--border', 'black');
        r.style.setProperty('--inverseText', 'white');
        r.style.setProperty('--inverseBack', 'black');
        r.style.setProperty('--resetTime', 'black');
        r.style.setProperty('--pauseTime', 'rgb(255, 111, 0)');
        r.style.setProperty('--runningTime', 'rgb(26, 110, 0)');
        r.style.setProperty('--iconBefore', '0.3');
        r.style.setProperty('--iconAfter', '0.6');
    }

    function darkMode() {
        changeModeButton.childNodes.forEach(node => {
            if (node.nodeName == 'IMG') {
                node.src = 'sun.png';
            }
            if (node.nodeName == '#text') {
                node.textContent = "Modo Claro";
            }
        }) 
        r.style.setProperty('--back', 'rgb(22, 22, 43)');
        r.style.setProperty('--text', 'white');
        r.style.setProperty('--border', 'white');
        r.style.setProperty('--inverseText', 'black');
        r.style.setProperty('--inverseBack', 'white');
        r.style.setProperty('--resetTime', 'white');
        r.style.setProperty('--pauseTime', 'yellow');
        r.style.setProperty('--runningTime', 'limegreen');
        r.style.setProperty('--iconBefore', '1');
        r.style.setProperty('--iconAfter', '0.5');
    }

    function refreshAlarmsList() {
        var index = 1;
        existingAlarms.innerHTML = '';
        if (alarmsArr == '' || alarmsArr == null) {
            var p = document.createElement('p');
            p.classList.add('text-small')
            p.innerHTML = `Não há nenhum alarme :(`
            existingAlarms.appendChild(p);
            alarmsArr = [];
        } else {
            alarmsArr.forEach(alarm => {
                var div = document.createElement('div');
                div.style.margin = '20px 0px';
                var p = document.createElement('p');
                p.classList.add('text-small');
                p.innerHTML = `Alarme ${index}: ${alarm}`;
                var b = document.createElement('button');
                b.classList.add('button');
                b.style.margin = '0px 0px 0px 10px';
                b.addEventListener('click', () => {
                    var i = alarmsArr.indexOf(alarm);
                    alarmsArr.splice(i, 1);
                    console.log(alarmsArr)
                    existingAlarms.removeChild(div);
                    localStorage.setItem('alarms', alarmsArr);
                    reloadAlarmsArray();
                    refreshAlarmsList();
                });
                var i = document.createElement('img');
                i.src = 'remove.png';
                i.classList.add('icon');
                i.style.width = '15px';
                i.style.margin = '5px';
                b.appendChild(i);
                div.appendChild(p);
                div.appendChild(b);
                existingAlarms.appendChild(div);
                index++;
                refreshButtonsIcons();
            });
        }
        localStorage.setItem('alarms', alarmsArr);
    }

    function downloadDynamicFile (filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    };

    function refreshRegistryList() {
        var index = 1;
        actionsRegistry.innerHTML = '';
        if (registryArr == '' || registryArr == null) {
            var p = document.createElement('p');
            p.classList.add('text-small')
            p.innerHTML = `Não há nenhum registro :(`
            actionsRegistry.appendChild(p);
            registryArr = [];
            titleRegistry.childNodes.forEach(node => {
                if (node.nodeName == 'BUTTON') {
                    titleRegistry.removeChild(node);
                }
            }) 
        } else {
            var c = false;
            titleRegistry.childNodes.forEach(node => {
                if (node.nodeName == 'BUTTON') {
                    c = true;
                }
            }) 
            if (!c) {
                var b = document.createElement('button');
                b.classList.add('button');
                b.addEventListener('click', () => {
                    var d = registryArr.toString()
                    d = d.replaceAll(",","\n");
                    downloadDynamicFile ('registro.txt', d);
                });
                var i = document.createElement('img');
                i.src = 'download.png';
                i.classList.add('icon');
                i.style.width = '15px';
                i.style.margin = '0px';
                b.appendChild(i);
                titleRegistry.appendChild(b);
            }
            registryArr.forEach(registry => {
                var p = document.createElement('p');
                p.classList.add('text-small')
                p.innerHTML = `${registry}`
                actionsRegistry.appendChild(p);
                index++;
            });
        }
        localStorage.setItem('registry', registryArr);
    }

    function verifyValue(i, l) {
        if (i.value < 0) {
            return null;
        } else if (i.value > l) {
            return null;
        } else {
            return i.value;
        } 
    }

    function addMouseHoverEvent(b) {
        var i;
        try {
            i = b.getElementsByClassName('icon')[0] 
        } catch(e) {
            console.log(e)
        }
        if (i != undefined) {
            b.addEventListener('mouseover', () => {
                i.style.filter = `invert(${rs.getPropertyValue('--iconAfter')})`;
            })
            b.addEventListener('mouseout', () => {
                i.style.filter = `invert(${rs.getPropertyValue('--iconBefore')})`;
            })
        }
    }

    function refreshButtonsIcons() {
        buttons = document.getElementsByClassName('button');
        for (var i = 0; i < buttons.length; i++) {
            addMouseHoverEvent(buttons[i])
        }
    }

    function reloadAlarmsArray() {
        if (localStorage.getItem('alarms') != null) {
            alarmsArr = localStorage.getItem('alarms').split(',')
        }
    }

    actionButton.addEventListener("click", () => {
        actionButton.childNodes.forEach(node => {
            if (node.nodeName == '#text') {
                if (node.textContent == "Iniciar cronômetro") {
                    startTimer();
                } else {
                    stopTimer();
                }
            }
        })   
    })

    pauseButton.addEventListener("click", () => {
        pauseButton.childNodes.forEach(node => {
            if (node.nodeName == '#text') {
                if (node.textContent == "Pausar cronômetro") {
                    pauseTimer();
                } else {
                    restartTimer();
                }
            }
        })   
    })

    changeModeButton.addEventListener("click", () => {
        changeModeButton.childNodes.forEach(node => {
            if (node.nodeName == '#text') {
                if (node.textContent == "Modo Claro") {
                    lightMode();
                } else {
                    darkMode();
                }
            }
        }) 
    })

    alarmButton.addEventListener("click", () => {
        if (alarms.classList.contains('hidden')) {
            alarms.classList.remove('hidden')
        } else {
            alarms.classList.add('hidden')
        }
    })

    addAlarmButton.addEventListener("click", () => {
        min = verifyValue(document.getElementById('min'), 999)
        sec = verifyValue(document.getElementById('sec'), 60)
        mil = verifyValue(document.getElementById('mil'), 1000)
        if (min == null || sec == null || mil == null) alert("Valores inválidos.")
        else {
            alarmsArr.push(`${formatTime(min)}:${formatTime(sec)}:${formatTime(mil, 3)}`);
            refreshAlarmsList();
        }
    })

    timerM = Math.floor(localStorage.getItem('timerM')) 
    timerMS = Math.floor(localStorage.getItem('timerMS')) 
    timerS = Math.floor(localStorage.getItem('timerS')) 

    if (localStorage.getItem('registry') != null) {
        registryArr = localStorage.getItem('registry').split(',')
    }
    
    if (timerM != 0 || timerMS != 0 || timerS != 0) {
        time.classList.remove('running', 'reset', 'pause');
        time.classList.add('pause');
        pauseButton.childNodes.forEach(node => {
            if (node.nodeName == '#text') {
                node.textContent = "Retomar cronômetro";
            }
            if (node.nodeName == 'IMG') {
                node.src = 'play.png';
            }
        })  
        pauseButton.classList.remove('hidden')
        actionButton.childNodes.forEach(node => {
            if (node.nodeName == '#text') {
                node.textContent = "Parar cronômetro";
            }
            if (node.nodeName == 'IMG') {
                node.src = 'close.png';
            }
        }) 
    } else {
        pauseButton.classList.add('hidden')
        actionButton.childNodes.forEach(node => {
            if (node.nodeName == '#text') {
                node.textContent = 'Iniciar cronômetro';
            }
        })
    }

    refreshAlarmsList();
    refreshRegistryList();
    refreshTimer();
    reloadAlarmsArray();
    refreshButtonsIcons();