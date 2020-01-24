


class Cities {
  static retrieveAll(knexInstance) {
    return knexInstance('cities').select('*');
  };


  static insert(knexInstance, city) {
   return knexInstance('cities').insert({name:city}).returning('*');



  }

  static delete(knexInstance, cityId) {
    return knexInstance('cities')
      .where('id', cityId)
      .del()

  }
}



module.exports = Cities;
