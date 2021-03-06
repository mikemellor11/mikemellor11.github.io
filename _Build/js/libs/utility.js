export function eachNode(nodes, cb){
    nodes = document.querySelectorAll(nodes);
    
    for(var i = 0, len = nodes.length; i < len; i++){
        cb(nodes[i], i);
    }
};

export function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
};

export function load(path, mimetype) {
    return new Promise((resolve) => {
        var xobj = new XMLHttpRequest();
        if(mimetype){
            xobj.overrideMimeType(mimetype);
        }
        xobj.open('GET', path, true);
        xobj.onreadystatechange = function () {
            if(xobj.readyState === 4 && (+xobj.status === 200 || +xobj.status === 0)){
                resolve(JSON.parse(xobj.responseText));
            }
        };
        xobj.send(null);
    });
};

export function classList(el) {
    var list = el.classList;

    return {
        toggle: function(c) { list.toggle(c); return this; },
        add:    function(c) { list.add   (c); return this; },
        remove: function(c) { list.remove(c); return this; }
    };
}

var blueprints = {};
export function blueprint(selector, array, cb, root){
    var nodes = (root || document).querySelectorAll(selector);

    var blueprint;

    if(blueprints[selector]){
        blueprint = blueprints[selector];
    } else {
        blueprint = nodes[0].children[0];
        blueprint.classList.remove('ut-hide');
        blueprints[selector] = blueprint;
    }

    var docFrag = document.createDocumentFragment();

    array.forEach(function(d, i){
        var item = blueprint.cloneNode(true);

        cb(item, d, i);

        docFrag.appendChild(item);
    });

    for(var i = nodes.length; i--;){
        nodes[i].innerHTML = '';

        nodes[i].appendChild(docFrag);
    }
};

export function toggles(){
    let nodes = document.querySelectorAll('.js-active');

    for(var i = nodes.length; i--;){
        nodes[i].onclick = function(e) {
            let nodes = document.querySelectorAll(this.dataset.target);

            for(var j = nodes.length; j--;){
                nodes[j].classList.toggle('active');
            }
        };
    }
}