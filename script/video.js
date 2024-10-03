//seconds to time
function getTimeSting(time){
    let hour = parseInt(time / 3600);
    let sec = time % 3600;
    let remainingSec = sec % 60;
    let min = parseInt(sec / 60);
    return `${hour}h ${min}m ${remainingSec}s`;
}

//video catagories load and show on html
const loadCata = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then((response) => response.json())
    .then((data) => displayCata(data.categories))
    .catch((error) => console.error('Error', error));
};

const loadCateVideos = (id) => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((response) => response.json())
    .then((data) => {
        displayVideos(data.category)
    })
    .catch((error) => console.error('Error', error));
}

const displayCata = (cate) => {
    const cateDiv = document.getElementById('category');
    cate.forEach((item) => {
        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML = `
            <button id="bt-${item.category_id}" onclick="loadCateVideos(${item.category_id})" class="btn">
                ${item.category}
            </button>
        `;
        cateDiv.append(buttonContainer);
    });
};

const loadDetails = async (videoId) => {
    const url = await fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`);
    const data = await url.json();
    displayDetails(data.video);    
}
const displayDetails = (video) => {
    const detailContainer = document.getElementById('modal-content');
    detailContainer.innerHTML = `
    <img src=${video.thumbnail} />
    <p>${video.description}<p/>
    `;
    document.getElementById('modal').showModal();
}
 
//videos load
const loadVideo = (text = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${text}`)
    .then((response) => response.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.error('Error!', error))
}

const displayVideos = (videos) => {
    const videoContainer = document.getElementById('videos');
    videoContainer.innerHTML = "";
    if(videos.length === 0){
        videoContainer.classList.remove("grid");
        videoContainer.innerHTML = `
          <div class="min-h-[500px] flex flex-col justify-center items-center">
              <img src="./assets/Icon.png">
              <h2 class="text-center text-xl font-bold">
                No Content here in this category!
              </h2>
          </div>
        `;
        return;
    }else{
        videoContainer.classList.add("grid");
    }
    videos.forEach((video) => {
        const card = document.createElement('div');
        card.classList = 'card card-compact';
        card.innerHTML = `
            <figure class="h-[200px] relative">
              <img class="w-full h-full object-cover"
                src=${video.thumbnail}
                alt="Shoes"/>
                ${
                    video.others.posted_date?.length === 0 
                    ? "" 
                    : `<span class="absolute bottom-2 right-2 px-2 text-white rounded-lg bg-gray-900 text-xs">${getTimeSting(video.others.posted_date)}</span>`
                }
            </figure>
            <div class="px-0 py-2 flex gap-2">
               <div>
                  <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture} alt="">
               </div>
               <div class="flex flex-col">
                   <h2 class="font-bold">${video.title}</h2>
                   <div class="flex justify-start items-center gap-2 ">
                      <p class="text-sm font-semibold text-gray-700">${video.authors[0].profile_name}</p>
                      ${video.authors[0].verified === true ? "<img class='w-6' src='https://img.icons8.com/?size=48&id=63262&format=png' alt='verify'>" : ""}
                   </div>
                   <p class="text-sm font-semibold text-gray-600">${video.others.views}</p>
                    <div>
                        <p>
                            <button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error">details video</button>
                        </p>
                    </div>
               </div>
            </div>             
        `;
        videoContainer.append(card);
    })
}
 
document.getElementById('input').addEventListener('keyup', (e)=> {
    loadVideo(e.target.value);
})

loadCata();
loadVideo();

