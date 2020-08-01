const CLIENT_ID =
  "773588291533-3kbp4uu69n2hj71t9ef57ugm3icdt2tm.apps.googleusercontent.com";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/youtube.readonly";

const authorizeButton = document.getElementById("authorize-button");
const signoutButton = document.getElementById("signout-button");
const content = document.getElementById("content");
const channelForm = document.getElementById("channel-form");
const channelInput = document.getElementById("channel-input");
const videoContainer = document.getElementById("video-container");

const defaultChannel = "techguyweb";
channelForm.addEventListener("submit",e=>{
  e.preventDefault();
  const channel=channelInput.value;
  getChannel(channel);
})
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}
function initClient() {
  gapi.client
    .init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES,
    })
    .then(() => {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    });
}
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";
    content.style.display = "block";
    videoContainer.style.display = "block";
    getChannel(defaultChannel);
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
    content.style.display = "none";
    videoContainer.style.display = "none";
  }
}
function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn();
}
function handleSignoutClick() {
  gapi.auth2.getAuthInstance().signOut();
}
function showChannelData(data){
  const channelData=document.getElementById('channel-data');
  channelData.innerHTML=data;
}
function getChannel(channel) {
  gapi.client.youtube.channels
    .list({
      part: "snippet,contentDetails,statistics",
      forUsername: channel,
    })
    .then((response) => {
      console.log(response);
      const channel = response.result.items[0];
      const output = `
        <ul class="collection">
          <li class="collection-item">Title: ${channel.snippet.title}</li>
          <li class="collection-item">ID: ${channel.id}</li>
          <li class="collection-item">Subscribers: ${channel.statistics.subscriberCount}</li>
          <li class="collection-item">Views: ${channel.statistics.viewCount}</li>
          <li class="collection-item">Videos: ${channel.statistics.videoCount}</li>
        </ul>
        <p>${channel.snippet.description}</p>
        <hr>
        <a class="btn grey darken-2" target="_blank" href="https://youtube.com/${channel.snippet.customUrl}">Visit Channel</a>
      `;
      showChannelData(output);
      const playlistId=channel.contentDetails.relatedPlaylists.uploads;
      requestVideoPlaylist(playlistId);
    })
    .catch((err) => alert("No channel by that name"));
}
function requestVideoPlaylist(playlistId){
  const requestOptions={
    playlistId:playlistId,
    part:'snippet',
    maxResults:10
  }
  const request=gapi.client.youtube.playlistItems.list(requestOptions);
  request.execute(response=>{
    console.log(response);
  })
}
