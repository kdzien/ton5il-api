import { getCategories } from './categoryController';
import { ProductModel } from '../models/Product';
import { CategoryModel } from '../models/Category';
import * as cheerio from 'cheerio';
import * as request from 'request';
import { Request, Response } from 'express';

export const addProduct = async (req: Request, res: Response) => {
  try{
    const new_product = new ProductModel({
    })
    await new_product.save();
    res.send(new_product)
  }catch(err){
    res.send(err)
  }
}

export const getProducts = async (req: Request, res: Response) => {
  const category_id = req.params.category_id;
  try{
    const products = await ProductModel.getProducts(category_id);
    const category = await CategoryModel.getCategory(category_id);
    res.send({
      category:category,
      products:products
    })
  }catch(err){
    res.send(err);
  }
}
export const findInShop = async (req: Request, res: Response) => {
  const find_phrase = req.params.find_phrase;
  console.log(find_phrase)
  try{
    const products = await ProductModel.findProducts(find_phrase);
    res.send(products)
  }catch(err){
    res.send(err);
  }
}
export const getProduct = async (req: Request, res: Response) => {
  const product_id = req.params.product_id
  try{
    const product = await ProductModel.getProduct(product_id);
    res.send(product)
  }catch(err){
    res.send(err);
  }
}
export const getPromo = async (req: Request, res: Response) => {
  try{
    const bestsellers = await ProductModel.getBestsellers();
    const news = await ProductModel.getNews();
    res.send({
      bestsellers:bestsellers,
      news:news
    })
  }catch(err){
    res.send(err)
  }
}

export const getDataFromProducer = (req: Request, res: Response) => {
  const base_href = 'http://www.skleptonsil.pl/';
  let categories = [];
  request(base_href, function (error, response, html) {
    if (error) {
        console.log(error);
    }
    else {
        let $ = cheerio.load(html);
        $(".categories > li a").not("ul li ul a").each(function () {
            categories.push({name: $(this).text(), href:`${base_href}${$(this).attr('href')}`, products_links:[], products:[]})
        });
        let categories_promises = [];
        categories.forEach(elem=>{
          categories_promises.push(new Promise((resolve,reject)=>{
            request(elem.href, function (error, response, html) {
              if(error){
                reject(error)
              }
              else{
                let $ = cheerio.load(html);
                $('.product').each(function(){
                  elem.products_links.push(`${base_href}${$(this).find('.add-to-cart').attr('href')}`)
                  resolve()
                })
              }
            })
          }))
        })
        let product_promises = [];
        Promise.all([categories_promises[0]]).then(result=>{
          categories.forEach(elem=>{
            elem.products_links.forEach(product => {
              product_promises.push(new Promise((resolve,reject)=>{
                request(product, function (error, response, html) {
                  if(error){
                    reject(error)
                  }
                  else{
                    let $ = cheerio.load(html);
                    $('#product-container').each(function(){

                      elem.products.push({
                        name: `${$(this).find('h1').first().text().trim()}`,
                        producer: `${$(this).find('.producer.k1 a').text().trim()}`,
                        condition: 'new',
                        quantity:4,
                        price:`${$(this).find('.price-box p.price .cenaJs').text().trim()}`,
                        img_src: `${base_href}${$(this).find('.product-img a').first().attr('href')}`,
                        description:`${$(this).find('.desc-text').html()}`,
                      })
                    })
                    resolve()
                  }
                })
              }))
            })
          })
          Promise.all(product_promises).then(result=>{
            categories.forEach(async (category,i) => {
              try{
                const new_category = new CategoryModel({
                  name:category.name
                })
                await new_category.save();
                category.products.forEach(async (product,i) => {
                  const new_product = new ProductModel({
                    name:product.name,
                    producer:product.producer,
                    condition:product.condition,
                    quantity:product.quantity,
                    price:product.price,
                    img_src:product.img_src,
                    description:product.description,
                    sold:0,
                    date_add:new Date(),
                    category: new_category._id
                  })
                  await new_product.save();
                })
                if(i==categories.length-1){
                  res.send('gotowe')
                }
              }catch(err){
                res.send(err)
              }
            })
          }).catch(err => {
            res.send(err)
          })
        }).catch(err => {
          res.send(err)
        })
    }
});
}
