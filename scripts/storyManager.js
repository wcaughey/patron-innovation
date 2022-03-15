

function loadStory(storyUrl) {
    return new Promise((resolve, reject) => {
        fetch(storyUrl)
        .then(data=>data.json())
        .then(jsonData=> {
            var manager = new StoryManager(jsonData);
            resolve(manager);
        });
    });
}

class StoryManager {
    storyData = {}
    //The story manager needs a reference to the media element so that it can check the 
    //current time offset when determining if a hit spot is active.
    mediaElement = null;
    constructor(storyData, mediaElement) {
        this.storyData = storyData;
        this.mediaElement = mediaElement;
    }

    processClick(azimuth, altitude) {


    }
    
}