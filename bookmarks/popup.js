
// chrome.tabs.create({}, function (e){
//   alert('hey bro');
// });

var cionApp = {
  startApp: function() {
    console.log('appStarted');
  },
};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  cionApp.startApp();
  alert('asdf');
});
