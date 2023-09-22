const Realm = require('realm');

async function getRealm(schema) {
    try {
      const realm = await Realm.open({
        schema: [schema],
      });
      return realm;
    } catch (error) {
      console.error('Error opening Realm instance:', error);
      throw error;
    }
  }

module.exports=getRealm