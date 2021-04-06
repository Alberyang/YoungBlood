package com.youngblood.dao;



import com.youngblood.entity.InfoSnapshot;

import java.util.List;

public interface InfoSnapshotDao {
    InfoSnapshot findUpDateById(String id);
    boolean deleteOutDate(); //just using it for test
    boolean insertBatch(List data);
    InfoSnapshot findOutDateById(String id);

}
