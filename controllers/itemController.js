// const Item = require('../models/Item');

// const createItem = async (req, res) => {
//   try {
//     const newItem = new Item(req.body);
//     await newItem.save();
//     res.status(201).json(newItem);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getItems = async (req, res) => {
//   try {
//     const items = await Item.find();
//     res.status(200).json(items);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const updateItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
//     res.status(200).json(updatedItem);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const deleteItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Item.findByIdAndDelete(id);
//     res.status(200).json({ message: "Item deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { createItem, getItems, updateItem, deleteItem };



const Item = require('../models/Item');

// Create new item
const createItem = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }
    const { imageUrl, title, description, price, availability } = req.body;
    console.log("imageUrl",imageUrl);
    console.log("title",title);
    console.log("description",description);
    console.log("price",price);
    console.log("availability",availability);
    console.log("req.body",req.body);
    const newItem = new Item(req.body);
    const validationError = newItem.validateSync();
    if (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item', details: err.message });
  }
};

// Get all items with optional filtering
const getItems = async (req, res) => {
  try {
    const { sort, limit = 10, page = 1, ...filters } = req.query;
    const skip = (page - 1) * limit;

    let query = Item.find(filters);
    
    if (sort) {
      query = query.sort(sort);
    }

    const [items, total] = await Promise.all([
      query.skip(skip).limit(parseInt(limit)),
      Item.countDocuments(filters)
    ]);

    res.status(200).json({
      items,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items', details: err.message });
  }
};

// Get single item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item', details: err.message });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item', details: err.message });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
      message: 'Item deleted successfully',
      id: req.params.id
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item', details: err.message });
  }
};

// Batch operations
const batchDeleteItems = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Array of item IDs is required' });
    }

    const result = await Item.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ 
      message: 'Items deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete items', details: err.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  batchDeleteItems
};