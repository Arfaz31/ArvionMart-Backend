import { Request } from "express"
import { PromoBanner } from "./promoBanner.model"
import QueryBuilder from "../../builder/QueryBuilder"


const createPromoBanner = async(req:Request)=>{
    const file = req.file
    const payload = req.body
    payload.bannerImage = file?.path
    const result = await PromoBanner.create(payload)
    return result
}

 const getPromoBanner = async(query : Record<string , unknown>) => {
    const result = await new QueryBuilder(PromoBanner.find(), query)
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

    const count = await new QueryBuilder(PromoBanner.find(), query).countTotal()

   
    return {
        count,
        result
    }
    
 }


export const PromoBannerService = {
    createPromoBanner,
    getPromoBanner,
}