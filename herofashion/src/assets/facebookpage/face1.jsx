import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Tag } from 'primereact/tag';

export default function Face1() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://10.1.21.13:7001/api/image')
            .then(res => {
                setData(res.data); // assuming it's an array of objects
            })
            .catch(err => {
                console.error('API fetch error:', err);
            });
    }, []);

    const responsiveOptions = [
        { breakpoint: '1400px', numVisible: 2, numScroll: 1 },
        { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
        { breakpoint: '767px', numVisible: 2, numScroll: 1 },
        { breakpoint: '575px', numVisible: 1, numScroll: 1 }
    ];

    const productTemplate = (item) => {
        return (
            <div className="gap-x-80 border-1 surface-border border-round m-2 text-center py-5 px-3 justify-items-center w-50 bg-amber-200">
                <div className="mb-3">
                    <img src={item.securePhoto1} alt={item.name} className="w-6 shadow-2" />
                </div>
                <div>
                    <h4 className="mb-1">{item.name}</h4>
                    <h6 className="mt-0 mb-3">${item.price}</h6>
                    <Tag value={item.status || 'INSTOCK'} severity="success" />
                    <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
                        <Button icon="pi pi-search" className="p-button p-button-rounded" />
                        <Button icon="pi pi-star-fill" className="p-button-success p-button-rounded" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="px-48 card justify-content-center">
            <Carousel
                value={data}
                numVisible={7}
                numScroll={3}
                responsiveOptions={responsiveOptions}
                className="custom-carousel"
                circular
                autoplayInterval={3000}
                itemTemplate={productTemplate}
            />
        </div>
    );
}
