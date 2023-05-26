let searchLastUpdate = 0;
let targetMaxInterval = 150;
let lastQuery = ''
let videos;

async function updateSearch(){
  if(!window.db){
    setTimeout(updateSearch,150)
    return
  }
  let inp = document.querySelector('#search-input')
  let searchValue = inp.value
  if(true){
      searchValue = searchValue + "*"
  }
  let query
  if(inp.value == ""){
    query = `select * from video_search order by date desc`
  }
  else {
    query = `select * from video_search where video_search match "${searchValue}" order by rank, date desc`
  }
  if(query != lastQuery){
    videos = await window.db.query(query)
  }
  let videoEl = document.querySelector('.videos')
  videoEl.innerHTML = ''
  for(let video of videos){
    let el = document.createElement('div')
    el.classList.add('video')
    el.innerHTML = `
    <a href="${video.video_url}"><img src="${video.thumbnail}"/></a>
    <div class="video-text">
      <span class="video-band">${video.band}</span>
      <br/>
      <span class="video-venue">${video.venue_name}</span>
      <br/>
      <span class="video-date">${video.date}</span>
    </div>
    `
    videoEl.appendChild(el)
  }

  // let current_video_el = document.querySelector('.current-video')
  // let el = document.createElement('iframe')
  // video_id = videos[0].video_url.split('?v=')[1]
  // el.src = `https://www.youtube.com/embed/${video_id}`
  // current_video_el.appendChild(el)
  // searchLastUpdate = Date.now()
  // setTimeout(updateSearch(inp),150)
}