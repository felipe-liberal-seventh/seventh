const Sequelize = require('sequelize');
const db = require(__dirname + '/../models/index');
const Op = Sequelize.Op

class MonitorController {

    async countMonitorHost(req, res, next){    
        const page = 0;
        try {
            const operation = await db.monitorModel.findAll({ 
                group: ['hostId'],
                attributes: ['hostId', [Sequelize.fn('COUNT', 'hostId'), 'HostCount']],
                order:[[ 'monitorDate', 'DESC']]})
            if(!operation){
                return res.status(404).send('Nenhum monitor encontrado')
            }else{
                return res.status(200).json(operation)
            }   
        }catch(e) {
            console.log(e)
            return res.status(400).send('Something broke!');
        }
    }
    async getMonitortByHostId(req, res, next){   
        try{
            const id  = req.params.id; 
            

            let operation  = await db.monitorModel.findAll({
                    where:[{hostId: id},{ 
                        monitorDate: {
                        [Op.lt]: new Date(),
                        [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
                        }
                    }
                    ],
                    limit:1440,
                    attributes: ['id','hostId','monitorDate','url','status','statusCod','timeResponse'], 
                })

            if(!operation){
                return res.status(404).send('Nenhum monitor encontrado')
            }else{
                return res.status(200).json(operation)
            }            
        }catch(e){
                console.log(e)
                return res.sendStatus(400);
            }
        }
    async getMonitortById(req, res, next){   
        try{
            const id  = req.params.id; 

            let operation 
            id ? operation = await db.hostModel.findOne({
                where:{id: id},
                attributes: ['id','name','protocol','domain','path'],  
                include: [ { 
                    where:{
                        monitorDate: {
                            [Op.lt]: new Date(),
                            [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
                        }},
                    limit:1440,
                    attributes: ['id','hostId','monitorDate','url','status','statusCod','timeResponse'], 
                    model: db.monitorModel, 
                    as: 'results' 
                }] }) : operation = await db.hostModel.findOne({
                    attributes: ['id','name','protocol','domain','path'],  
                    include: [ { 
                        where:{
                            monitorDate: {
                                [Op.lt]: new Date(),
                                [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
                            }},
                        limit:1440,
                        model: db.monitorModel, 
                        attributes: ['id','hostId','monitorDate','url','status','statusCod','timeResponse'], 
                        as: 'results' }] })

            if(!operation){
                return res.status(404).send('Nenhum monitor encontrado')
            }else{
                return res.status(200).json(operation)
            }            
        }catch(e){
                console.log(e)
                return res.sendStatus(400);
            }
        }
    async addMonitor(req, res, next){
        try {
            const {name, url, statusCod, status, timeResponse, monitorDate, hostId} = req.body;

            const operation = await db.monitorModel.create({name:name, url:url, statusCod:statusCod, status:status, timeResponse:timeResponse, monitorDate:monitorDate, hostId:hostId})
            if(!operation){
                return res.status(500).send('Falha na operação')
            }else{
                return res.status(201).json(operation)
            }
        }catch(err) {
           return res.sendStatus(404)
        };
    }
}
module.exports = new MonitorController();