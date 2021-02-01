
import { getData, getNotes } from './index.js';
import { renderLabels } from './sidenav.js';
import { renderLabelsPopup } from './labels.js';

class Router {
    constructor( routes ) {
        this.prevLocation = "";
        this.currentLocation = window.location.hash.substring(1);
        this.routes = routes;
        this.action();
    }

    navigateTo( location ) {
        this.prevLocation = this.currentLocation;
        this.currentLocation = location;
        window.location.hash = location;
        this.action();
    }

    action() {
        let reqdRoutePath = this.currentLocation.split("/");
        let reqdRoute = null;
        for(let route of this.routes) {
            let path = route.path.split("/");
            if(path.length == reqdRoutePath.length) {
                let found = true;
                for(let i = 0;i < path.length;i++) {
                    if( path[i] != reqdRoutePath[i] && path[i].charAt(0) != ':' ) {
                        found = false;
                        break;
                    }
                }
                if(found) {
                    reqdRoute = route;
                    break;
                }
            }
        }
        reqdRoute?.action.call(this);
    }
}

let routes = [
    { path: "notes", action: function() { getNotes("notes"); } },
    { path: "reminders", action: function() { getNotes("reminders"); } },
    { path: "labels", action: function() { renderLabelsPopup(); } },
    { path: "labels/:id", action: function() { 
        getNotes(this.currentLocation); 
    } },
    { path: "archive", action: function() { getNotes("archive"); } },
    { path: "bin", action: function () { getNotes("bin"); } },
];

export let router = new Router(routes);

window.onload = init;

function init() {
    renderLabels();
}