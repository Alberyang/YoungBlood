package com.youngblood.dao.impl;

import com.youngblood.dao.InfoSnapshotDao;
import com.youngblood.entity.HeatInfoProperties;
import com.youngblood.entity.InfoSnapshot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;


@Repository
public class InfoSnapshotDAOImpl implements InfoSnapshotDao {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private HeatInfoProperties heatInfoProperties;
    // find the most recent record for this ID
    @Override
    public InfoSnapshot findUpDateById(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("oriInfoId").is(id));
        query.with(Sort.by(Sort.Order.desc("createDate")));
        return mongoTemplate.findOne(query, InfoSnapshot.class);
    }

    @Override
    public boolean deleteOutDate() {
        Query query = new Query();
        Date date = new Date();
        long minusTime = heatInfoProperties.getSnapshot_del_time();
        date.setTime(date.getTime() - minusTime);
        query.addCriteria(Criteria.where("createDate").lt(date.getTime()/1000));
        try {
            mongoTemplate.remove(query, InfoSnapshot.class);
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }
    // Bulk insert
    @Override
    public boolean insertBatch(List data) {
        BulkOperations ops = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED,"info_snapshot");
        try {
            ops.insert(data);
            ops.execute();
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }
    //  find the out date info within 2 hours
    @Override
    public InfoSnapshot findOutDateById(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("oriInfoId").is(id));
        query.with(Sort.by(Sort.Order.asc("createDate")));
        return mongoTemplate.findOne(query, InfoSnapshot.class);
    }
}
