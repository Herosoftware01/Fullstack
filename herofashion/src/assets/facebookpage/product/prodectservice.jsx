export const ProductService = {
    getProductsSmall() {
        return fetch('http://localhost:3000/api/image')
            .then((res) => res.json())
            .then((d) => d.data);
    }
};
