

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
    currentState = "video-01";

    
    constructor(storyData, mediaElement) {
        var self = this;        
        this.storyData = storyData;
        var videoUrl = this.storyData.states[this.currentState].video
        this.mediaElement = mediaElement;
        this.mediaElement.addEventListener('ended', (evt)=>{self.onVideoEnded(evt)});
        this.mediaElement.setAttribute('src', videoUrl);
        
    }


    onVideoEnded(event) { 
        let currentStateData = this.storyData.states[this.currentState];
        switch(currentStateData.onEnded)
        {
            case 'loop': {
                var targetOffset = currentStateData.loopOffset || 0;
                console.log(`video ended, going to time offset ${targetOffset} seconds`)
                this.mediaElement.currentTime = currentStateData.loopOffset || 0;
                this.mediaElement.currentTime = targetOffset;
                this.mediaElement.play();
            }
            break;
            case 'navigate': {
                if(currentStateData.navigateTarget) {
                    this.currentState = currentStateData.navigateTarget;
                    this.mediaElement.setAttribute('src', this.storyData.states[this.currentState].video);
                    this.mediaElement.play();
                }
            }
            break;
            default:
                break;
        }
    }

    processClick(azimuth, altitude) {
        var currentTime = this.mediaElement.currentTime;
        let currentStateData = this.storyData.states[this.currentState];
        if(currentStateData == null)
            return;
        //Grab the interactions for the current story state
        var interactionList = currentStateData.interactions;
        //we only want to examine the ones associated with taps
        var tapInteractions = interactionList.filter(i=>i.interactionType = "tap");
        //only consider the ones that have active times overlapping with the current media time
        var activeList = tapInteractions.filter(i => { 
            return (i.activeStart == null || currentTime >= i.activeStart) && (i.activeEnd == null || currentTime <= i.activeEnd)
        });
        //Find the distances between the spot the user touched and the listed hit points
        var clickDistances = [];
        activeList.forEach(i=>{
            var distance = DistanceCalculator.CalcDistance(azimuth, altitude, i.position.azimuth, i.position.altitude, DistanceCalculator.Circle360Radius);
            clickDistances.push({"distance":distance, i});
        });
        //Sort the hitpoints by distance. IF there is any overlap in hit points,
        //the closest to the hit point gets priority
        clickDistances.sort((a,b)=>a-b);
        var withinVariance  = clickDistances.filter(i=>i)
    }

}