const Settings = require('../models/Settings');

const seedSettings = async () => {
  try {
    const defaultSettings = [
      {
        key: 'easypaisa_number',
        value: '03001234567',
        description: 'The official EasyPaisa account number for Handify commissions'
      },
      {
        key: 'easypaisa_account_name',
        value: 'Handify Services',
        description: 'Account title for EasyPaisa'
      },
      {
        key: 'commission_low',
        value: '5',
        description: 'Commission percentage for services up to Rs. 500'
      },
      {
        key: 'commission_mid',
        value: '10',
        description: 'Commission percentage for services between Rs. 501 and Rs. 800'
      },
      {
        key: 'commission_high',
        value: '15',
        description: 'Commission percentage for services above Rs. 800'
      }
    ];

    for (const s of defaultSettings) {
      const exists = await Settings.findOne({ key: s.key });
      if (!exists) {
        await new Settings(s).save();
        console.log(`Setting created: ${s.key}`);
      }
    }
  } catch (error) {
    console.error('Error seeding settings:', error);
  }
};

module.exports = seedSettings;