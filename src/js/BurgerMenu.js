class BurgerMenu {
    constructor(root) {
        this.root = root;
        if(!this.root) {
            throw "Element not found";
        }

        this.burgerMenu = root.querySelector('.burger__menu');
        this.burgerButton = root.querySelector('.burger__button');
        this.burgerMenu = document.querySelector('.burger-menu');

        this.init();
    }

    init() {
        this.modal = UIkit.modal(this.burgerMenu);
        this.burgerButton.addEventListener('click', (event) => {
            this.burgerButton.classList.toggle('burger__button_active');
            this.modal.toggle();
        });

        UIkit.util.on('#burger-menu', 'hide', () => {
            this.burgerButton.classList.remove('burger__button_active');
        });
    }
}

export default BurgerMenu;