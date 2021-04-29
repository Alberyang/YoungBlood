package com.youngblood.dao.impl;

import com.youngblood.dao.InfoHeatDao;
import com.youngblood.entity.InfoHeat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class InfoHeatDaoImpl implements InfoHeatDao {
    @Autowired
    MongoTemplate mongoTemplate;
    @Override
    public boolean insertBatch(List data) {
        BulkOperations ops = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED,"info_heat");
        try {
            ops.insert(data);
            ops.execute();
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public boolean dropCollection() {
        try {
            mongoTemplate.getCollection("info_heat").drop();
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public List<InfoHeat> getAllCurHeatInfo() {
        return mongoTemplate.findAll(InfoHeat.class);
    }
}
