(function() {
	// Konfiguration
	
	var _minAmplitude = 3.5;
	var _timeout = 600;
	
	// Achsen-Arrays (sind nur innerhalb der Funktion verfügbar)
	var x = [];
	var y = [];
	var z = [];
	
	// Funktion triggert das Event
	var triggerEvent = function(axe) {
		var event = new CustomEvent("x-deviceagitation", 
			{
				"detail":{"axe":axe},
				bubbles: false,
				cancelable: true
			}
		);
		window.dispatchEvent(event);
		x = [];
		y = [];
		z = [];
		return true;
	};
	
	// Timeout-Funktion zum Löschen der Werte in den Achsen-Arrays
	var shiftX = function() { x.shift();};
	var shiftY = function() { y.shift();};
	var shiftZ = function() { z.shift();};
	
	// Funktion, die ausgeführt wird, wenn der Bewegungssensor ein Event feuert
	var EventListener = function(eventData) {
		if(typeof eventData.acceleration !== "undefined") {
            // Alte Geräte mit einbeziehen
            var acceleration;
            if(eventData.acceleration.x !== null) {
                acceleration = eventData.acceleration;
            }
            else if(eventData.accelerationIncludingGravity.x !== null) {
                acceleration = eventData.accelerationIncludingGravity;
            }
            else {
                return false;
            }
			if((acceleration.x !== null) && 
				(Math.abs(acceleration.x) > _minAmplitude )) {
				if((x.length > 0) && ((acceleration.x*x[x.length-1]) < 0)) {
					x.push(acceleration.x);
                    if(x.length >= _minAmplitude) {
						triggerEvent("x");
					}
				}
				else if(x.length === 0) {
					x = [acceleration.x];
				}
				setTimeout(shiftX, _timeout);
			}
			if((acceleration.y !== null) && 
				(Math.abs(acceleration.y) > _minAmplitude )) {
				if((y.length > 0) && ((acceleration.y*y[y.length-1]) < 0)) {
					y.push(acceleration.y);
					if(y.length >= _minAmplitude) {
						triggerEvent("y");
					}
				}
				else if(y.length === 0) {
					y = [acceleration.y];
				}
				setTimeout(shiftY, _timeout);
			}
			if((acceleration.z !== null) && 
				(Math.abs(acceleration.z) > _minAmplitude )) {
				if((z.length > 0) && ((acceleration.z*z[z.length-1]) < 0)) {
					z.push(acceleration.z);
					if(z.length >= _minAmplitude) {
						triggerEvent("z");
					}
				}
				else if(z.length === 0) {
					z = [acceleration.z];
				}
				setTimeout(shiftZ, _timeout);
			}
		}
	};
	
	//Installation der Funktion
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', EventListener , false);
	}
})();
