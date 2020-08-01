const CLIENT_ID='773588291533-3kbp4uu69n2hj71t9ef57ugm3icdt2tm.apps.googleusercontent.com';
const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
  ];
  const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';
  
  const authorizeButton = document.getElementById('authorize-button');
  const signoutButton = document.getElementById('signout-button');
  const content = document.getElementById('content');
  const channelForm = document.getElementById('channel-form');
  const channelInput = document.getElementById('channel-input');
  const videoContainer = document.getElementById('video-container');
  
  const defaultChannel = 'techguyweb';
function handleClientLoad(){
    gapi.load('client:auth2',initClient);
}
function initClient(){
    gapi.client.init({
        discoveryDocs:DISCOVERY_DOCS,
        clientId:CLIENT_ID,
        scope:SCOPES
    }).then(()=>{
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick=handleAuthClick;
        signoutButton.onclick=handleSignoutClick;
    });
}
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      content.style.display = 'block';
      videoContainer.style.display = 'block';
      getChannel(defaultChannel);
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
      content.style.display = 'none';
      videoContainer.style.display = 'none';
    }
  }
function handleAuthClick(){
    gapi.auth2.getAuthInstance().signIn();
}
function handleSignoutClick(){
    gapi.auth2.getAuthInstance().signOut();
}
function getChannel(channel){
    console.log(channel);
}