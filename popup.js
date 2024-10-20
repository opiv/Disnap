
let selectionActive = false;

document.getElementById('removeButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: selectAndModifyElements
        });
    });
});


function selectAndModifyElements() {
    var anim =(elem)=> {
        let id = null;
        let pos = 1.0; // Starting opacity at 0
        let pos2 = 0
        clearInterval(id);
        id = setInterval(frame, 50); // Slower frame rate for smoother animation

        function frame() {
            if (pos == 0.0) {
                clearInterval(id);
            } else {
                pos -= 0.05; // Increment opacity by a small amount
                pos2 += 1.5
                elem.style.opacity = pos; // Set the element's opacity
                elem.style.filter="blur("+String(pos2)+"px)"
            }
        }
    }

    const selectElement = (event) => {
        event.preventDefault();
        event.stopPropagation();

        var target = event.target;
        if (target) {
            anim(target)
            setTimeout(() => {
                target.remove();
                console.log('Removed element:', target);
                document.body.style.cursor = "normal";
                enableNavigation();
            }, 750);
        }
    };
    const disableNavigation = () => {
        document.addEventListener('click', preventNavigation, true);
    };
    
    const enableNavigation = () => {
        document.removeEventListener('click', preventNavigation, true);
    };
    
    const preventNavigation = (event) => {
        const target = event.target;
    
        if (target.tagName === 'A' || target.tagName === 'BUTTON') {
            event.preventDefault();
            event.stopPropagation();
            console.log('Navigation prevented for:', target);
        }
    };
    
    
    document.body.style="cursor: crosshair !important"
    
    disableNavigation();
    document.addEventListener('click', selectElement, false);
}
