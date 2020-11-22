import React from 'react';
// import { configure } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';

// configure({ adapter: new Adapter() });

// import chai, {expect} from 'chai';
// import chaiEnzyme from 'chai-enzyme';
// chai.use(chaiEnzyme());
// import {shallow} from 'enzyme';
import Product from '../src/components/Product/product'

describe('▒▒▒ Frontend tests ▒▒▒', function () {

    describe('Product', () => {

        describe('contenido visual', () => {

            // Antes de cada `it` spec, instanciamos un nuevo componente de React `Product`
            // `Product` viene del archivo `src/components/Product/product
            // Este componente va a recibir algo de data en su prop `
            // Guardamos este componente en un wrapper testeable `ProductWrapper`

            let productData, productWrapper;
            beforeEach('Crea un wrapper para <Product /> ', () => {
                productData = {
                    id: 5,
                    name: 'campera',
                    description: 'alguna descripcion de la campera',
                    price: '$100',
                    stock: '2'
                };
                // crea el wrapper testeable del componente
                productWrapper = shallow(<Product product={productData} />);
            });
            
            it('muestra el nombre del producto recibido en la prop dentro de "name"', () => {
                expect(productWrapper.find('h1')).to.have.html('Producto: campera');
            });

            it('muestra la descripcion del producto recibido como prop', () => {
                expect(productWrapper.find('p')).to.have.html('alguna descripcion de la campera');
            });

            it('muestra el precio del producto en el label "precio"', () => {
                expect(productWrapper.find('label')).to.have.html('Precio: $100');
            });

            it('muestra el stock disponible del producto', () => {
                expect(productWrapper.find('label')).to.have.html('Cantidad: 2');
            });

            // Estos tests requieren mayor entendimiento de JSX / React.
            // Aquí estamos demostrando que tu método `render` no debería
            // siempre retornar el mismo exacto string en su JSX, en cambio, el resultado
            // debería variar basado en la data pasada. ¿De dónde proviene esa data?
            // ¿Cómo obtenes acceso a él? Volve al `beforeEach` block para verlo.

            it('no esta harcodeado', () => {
                const aDifferentMessage = {
                    id: 3,
                    name: 'remera',
                    description: 'alguna descripcion de la remera',
                    price: '$80',
                    stock: '5'
                };
                // Hacemos un nuevo componente con distinta data, y chequeamos su contenido
                const differentMessageWrapper = shallow(<Message fullMessage={aDifferentMessage} />);
                expect(differentMessageWrapper.find('h1')).to.have.html('Producto: remera');
                expect(differentMessageWrapper.find('p')).to.have.html('alguna descripcion de la remera');
                expect(differentMessageWrapper.find('label')).to.have.html('Precio: $80');
                expect(differentMessageWrapper.find('label')).to.have.html('Cantidad: 5');
            });

        });
    });
});