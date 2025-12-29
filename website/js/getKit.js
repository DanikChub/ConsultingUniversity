const kit_items = document.querySelector('.kit_slider_slides');
const kit_buttons = document.querySelectorAll('.kit_button');
const items = [
    {id: 1, link: "./courses/specialist.html", img: 'intro_4.png', title: "Специалист в сфере  закупок (44-ФЗ)  для заказчиков", diplom: false, description: "Повышение квалификации 144 академических часа", price: "9 700"},
    {id: 2, link: "./courses/expert.html", img: 'intro_2.png', title: "Эксперт в сфере закупок (44-ФЗ, 223-ФЗ)  для заказчиков", diplom: true, description: "Профпереподготовка 260 академических часов", price: "12 700"},
    {id: 3, link: "./courses/contract_system.html", img: 'intro_5.png', title: "Контрактная система в сфере закупок  для руководителей (44-ФЗ)", diplom: false, description: "Повышение квалификации 40 академических часов", price: "5 700"},
   
]





function update(sort) {
    let s = '';
    items.forEach(el => {
       
        if (el.diplom == Boolean(Number(sort)) || sort == 'all') {

            s += `<a href="${el.link}" class="kit_slide glide__slide">
            <div class="kit_item_advantages">
                <div class="kit_item_advantage">лекции</div>
                <div class="kit_item_advantage">презентации</div>
                <div class="kit_item_advantage">видео-уроки</div>
            
            </div>
            <div class="kit_item_img">
                <img src="./imgs/bg/${el.img}" alt="">
                
            </div>
            <div class="kit_item_title">
                <p>${el.title}</p>
                <img src="${el.diplom?"./imgs/slider_docs/short_diplom.png":"./imgs/slider_docs/short_diplom1.png"}" alt="">
            </div>
            <div class="kit_item_description">${el.description}</div>
            <div class="kit_item_content">
                <div class="kit_item_price">${el.price} руб</div>
                <div  class="kit_item_button">Подробнее</div>
            </div>
            
        </a>`
        } 
        
    })
    
    kit_items.innerHTML = '';
    kit_items.innerHTML = s;

    if (innerWidth > 1150) {
        var glide = new Glide('#kit_slider', {
            type: 'slider',
            startAt: 0,
            perView: 3,
            gap: 32,
        
        
        })
    
        glide.mount()
        console.log(innerWidth )
    } else if (innerWidth <= 1150 && innerWidth > 828) {
        
        var glide = new Glide('#kit_slider', {
            type: 'slider',
            startAt: 0,
            perView: 2,
            gap: 32,
        
        
        })
    
        glide.mount()
    } else if (innerWidth <= 828) {
        console.log('435345534')
        var glide = new Glide('#kit_slider', {
            type: 'slider',
            startAt: 0,
            perView: 1,
            gap: 32,
        
        
        })
    
        glide.mount()
    } 
    
    
    
}

update('all')


kit_buttons.forEach(kit_button => {
    kit_button.addEventListener('click', () => {
        kit_buttons.forEach(el => el.classList.remove('active'));
        kit_button.classList.add('active')
        const type = kit_button.getAttribute('type')
        
        update(type)
    })
})


