package com.youngblood.dao;

import com.youngblood.entity.InfoHeat;

import java.util.List;

public interface InfoHeatDao {
    boolean insertBatch(List data);
    boolean dropCollection();
    List<InfoHeat> getAllCurHeatInfo(); //返回当前热度表中的所有动态 根据热度进行排行 此接口需要优化
}
