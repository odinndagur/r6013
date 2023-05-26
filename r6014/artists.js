let searchLastUpdate = 0;
let targetMaxInterval = 150;

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
    query = `select name from person order by name asc`
  }
  else {
    query = `select person.name, group_concat(band.name) as bands from person join band_member on person.id = band_member.member_id join band on band.id = band_member.band_id where name like "%${searchValue}%" order by person.name asc collate localized`
  }

  people = await window.db.query(query)
  let artistEl = document.querySelector('.artists')
  artistEl.innerHTML = ''
  for(let artist of people){
    let el = document.createElement('div')
    let bands = artist.bands.split(',').map(band => {
      `<span class="band-name">${band}</span>`
    }).join('')
    el.classList.add('artist')
    el.innerHTML = `    
      <span class="artist-name">${artist.name}</span>
      ${bands}
    `
    artistEl.appendChild(el)
  }

  // let current_video_el = document.querySelector('.current-video')
  // let el = document.createElement('iframe')
  // video_id = videos[0].video_url.split('?v=')[1]
  // el.src = `https://www.youtube.com/embed/${video_id}`
  // current_video_el.appendChild(el)
  // searchLastUpdate = Date.now()
  // setTimeout(updateSearch(inp),150)
}
