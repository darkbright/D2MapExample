// 마지막 문자를 반환
String.prototype.splitPop = function (text) {
	return this.split(text).pop();
};

function toIEColor(JQueryElement, color, isDisabled) {
	if (isIE()) {
		if (color != undefined) JQueryElement.spectrum({ color: color, preferredFormat: 'hex' });
		if (isDisabled != undefined) {
			if (isDisabled) JQueryElement.spectrum('disable');
			else JQueryElement.spectrum('enable');
		}
	} else {
		if (color != undefined) JQueryElement.val(color);
		if (isDisabled != undefined) JQueryElement.attr('disabled', isDisabled);
	}
}

function isIE() {
	var agent = navigator.userAgent.toLowerCase();
	if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || agent.indexOf('msie') != -1) return true;
	else return false;
}

function pad(n, width) {
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function siblings(t) {
	const children = t.parentElement.children;
	const tempArr = [];

	for (let i = 0; i < children.length; i++) {
		tempArr.push(children[i]);
	}

	return tempArr.filter(function (e) {
		return e != t;
	});
}

function showElement(selector, boolean) {
	var elem;
	if (selector instanceof HTMLElement) {
		elem = selector;
		if (Array.isArray(elem) == false)
			elem = [elem];
	}
	else {
		elem = document.querySelectorAll(selector);
	}
	elem.forEach(function (e) {
		e.style.display = boolean ? 'block' : 'none';
	})
}