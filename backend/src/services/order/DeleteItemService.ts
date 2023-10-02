import prismaClient from "../../prisma"

interface DeleteItemRequest {
    item_id: string;
}

class DeleteItemService {
    async execute({item_id}:DeleteItemRequest){

        const item = await prismaClient.item.delete({
            where:{
                id: item_id
            }
        })

        return item
    }
}

export { DeleteItemService }