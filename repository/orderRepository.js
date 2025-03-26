import { db } from './db.js';

/**
 * 카카오페이 결제 완료 시 shoppy_order 테이블에 저장
 */
export const add = async(formData) => {
    
    const result = await Promise.all(          
        formData.orderList.map(async(item) => {
            // const id= 'guest';
            const id = formData.id;
            const values = [
                item.size,
                item.qty,
                formData.totalPrice,
                formData.type,
                formData.tid,
                id,
                item.pid
            ];    
            formData.id === 'guest' && await execute(`SET FOREIGN_KEY_CHECKS = 0 `);
            const sql = `
                insert into shoppy_order(size, qty, tprice, type, tid, id, pid, odate)
                    values(?, ?, ?, ?, ?, ?, ?, current_date())
            `;
            const [result] = await db.execute(sql, values); //Promise형태로 실행
            formData.id === 'guest' && await db.execute(`SET FOREIGN_KEY_CHECKS = 1 `);

            return result.affectedRows;            
        })   
    )
    const result_rows = result.reduce((acc, cur) => acc + cur, 0);
    return {"result_rows" : result_rows};
}

/**
 * 전체 주문정보 가져오기 : getOrderList
 */
export const getOrderList = async({id}) => {
    const sql = `
            select * from view_order_list
                where id=?
    `;
    const [result] = await db.execute(sql, [id]);
    return result; 
}