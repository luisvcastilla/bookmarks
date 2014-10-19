
// chrome.tabs.create({}, function (e){
//   alert('hey bro');
// });
Parse.initialize("zMzw4YOroYkmhM2YUgPjNMc9BQTxelTMwlb3Oy3h", "GCQ4URRqPsoyXyYVlc48rXuqZEr82Yd4DNeU2Bne");

var cionApp = {
  startApp: function() {
    console.log('appStarted');
  },
};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  cionApp.startApp();
});
