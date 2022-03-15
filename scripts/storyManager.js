

function loadStory(storyUrl, mediaElement) {
    return new Promise((resolve, reject) => {
        fetch(storyUrl)
        .then(data=>data.json())
        .then(jsonData=> {
            var manager = new StoryManager(jsonData, mediaElement);
            resolve(manager);
        });
    });
}



class StoryManager {
    storyData = {}
    //The story manager needs a reference to the media element so that it can check the 
    //current time offset when determining if a hit spot is active.
    mediaElement = null;
    currentState = "default";
    constructor(storyData, mediaElement) {
        this.storyData = storyData;
        this.mediaElement = mediaElement;
    }

    processClick(azimuth, altitude) {
        var currentTime = this.mediaElement.currentTime;

        let currentStateData = this.storyData.states[this.currentState];
        if(currentStateData == null)
            return;
        var interactionList = currentStateData.interactions;
        var tapInteractions = interactionList.filter(i=>i.interactionType = "tap");
        var activeList = tapInteractions.filter(i => { 
            return (i.activeStart == null || currentTime >= i.activeStart) && (i.activeEnd == null || currentTime <= i.activeEnd)
        });

        var clickDistances = [];
        activeList.forEach(i=>{
            var distance = DistanceCalculator.CalcDistance(azimuth, altitude, i.position.azimuth, i.position.altitude);
            clickDistances.push({"distance":distance, i});
        });

        clickDistances.sort((a,b)=>a-b)
        

    }
    
}