//sidebar appear in certain area
var sidebar = document.querySelector('.article-sidebar')
var banner = document.querySelector('.content-nav')
var bannerTop = banner.offsetTop+500
document.addEventListener('scroll', function(){
// console.log(window.pageYOffset);
if (window.pageYOffset >= bannerTop){
    sidebar.style.display = 'block';
}else{
    sidebar.style.display = 'none';
}
})