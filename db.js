// db.js — EmpowerHer Firebase CRUD (Final Clean Version)
import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs, getDoc, doc,
  updateDoc, setDoc, query, where, orderBy,
  serverTimestamp, limit, increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── LEARNING ───────────────────────────────────────────────
export async function fetchLearningTopics() {
  try {
    const snap = await getDocs(collection(db, "learning"));
    if (!snap.empty) return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { console.warn("learning:", e.message); }
  return getDefaultTopics();
}

function getDefaultTopics() {
  return [
    { id:"1", title:"Stock Market Basics",      content:"Learn what stocks are, how markets work, and how to read a stock chart. Understand risk vs reward and begin your investing journey.",                                         icon:"📈", tag:"Investing"    },
    { id:"2", title:"Budgeting 101",             content:"Master the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Create a budget that works with your lifestyle, not against it.",                                              icon:"💰", tag:"Budgeting"    },
    { id:"3", title:"Smart Saving Tips",         content:"Discover micro-saving strategies, high-yield savings accounts, and how to automate your savings so you save without thinking about it.",                                    icon:"🏦", tag:"Savings"      },
    { id:"4", title:"Women & Investing",         content:"Studies show women are better investors than men. Learn how to leverage this advantage and overcome the gender investment gap.",                                             icon:"👩‍💼", tag:"Empowerment" },
    { id:"5", title:"Understanding Mutual Funds",content:"Mutual funds pool money from many investors. Learn about NAV, SIP investments, and how to choose the right fund for your goals.",                                           icon:"📊", tag:"Investing"    },
    { id:"6", title:"Emergency Fund Guide",      content:"Every woman needs 3–6 months of expenses saved. Learn how to build your safety net step by step, starting with just ₹500.",                                                icon:"🛡️", tag:"Safety"      }
  ];
}

// ── USER CONTENT (Community posts & videos in Learn page) ─
export async function addUserContent(userId, userName, title, content, type, videoUrl = "") {
  return await addDoc(collection(db, "user_content"), {
    userId, userName, title, content, type, videoUrl, timestamp: serverTimestamp()
  });
}

export async function fetchUserContent() {
  try {
    const q = query(collection(db, "user_content"), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { return []; }
}

// ── TRANSACTIONS (Buy / Sell) ──────────────────────────────
export async function addTransaction(userId, item, price, type) {
  if (!item || !price) throw new Error("Item and price are required");
  return await addDoc(collection(db, "transactions"), {
    userId, item, price: parseFloat(price), type, timestamp: serverTimestamp()
  });
}

export async function fetchTransactions(userId) {
  try {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(20)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { console.warn("transactions:", e.message); return []; }
}

// ── INVESTMENTS ────────────────────────────────────────────
export async function addInvestment(userId, name, amount) {
  if (!name || !amount) throw new Error("Name and amount are required");
  return await addDoc(collection(db, "investments"), {
    userId, name, amount: parseFloat(amount), timestamp: serverTimestamp()
  });
}

export async function fetchInvestments(userId) {
  try {
    const q = query(
      collection(db, "investments"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { console.warn("investments:", e.message); return []; }
}

// ── EXPENSES ──────────────────────────────────────────────
export async function addExpense(userId, title, amount) {
  if (!title || !amount) throw new Error("Title and amount are required");
  return await addDoc(collection(db, "expenses"), {
    userId, title, amount: parseFloat(amount), timestamp: serverTimestamp()
  });
}

export async function fetchExpenses(userId) {
  try {
    const q = query(
      collection(db, "expenses"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { console.warn("expenses:", e.message); return []; }
}

// ── WALLET ─────────────────────────────────────────────────
export async function getWallet(userId) {
  try {
    const ref  = doc(db, "wallets", userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { userId, balance: 0, totalSaved: 0, totalWithdrawn: 0 });
      return { balance: 0, totalSaved: 0, totalWithdrawn: 0 };
    }
    return snap.data();
  } catch(e) { return { balance: 0, totalSaved: 0, totalWithdrawn: 0 }; }
}

export async function addMoney(userId, amount, note = "Added via GPay") {
  const amt = parseFloat(amount);
  if (!amt || amt <= 0) throw new Error("Invalid amount");
  const ref  = doc(db, "wallets", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { userId, balance: amt, totalSaved: amt, totalWithdrawn: 0 });
  } else {
    await updateDoc(ref, { balance: increment(amt), totalSaved: increment(amt) });
  }
  await addDoc(collection(db, "wallet_history"), {
    userId, type: "credit", amount: amt, note, timestamp: serverTimestamp()
  });
}

export async function withdrawMoney(userId, amount, note = "Withdrawal") {
  const amt  = parseFloat(amount);
  if (!amt || amt <= 0) throw new Error("Invalid amount");
  const ref  = doc(db, "wallets", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Wallet not found");
  if (amt > (snap.data().balance || 0)) throw new Error("Insufficient balance");
  await updateDoc(ref, { balance: increment(-amt), totalWithdrawn: increment(amt) });
  await addDoc(collection(db, "wallet_history"), {
    userId, type: "debit", amount: amt, note, timestamp: serverTimestamp()
  });
}

export async function fetchWalletHistory(userId) {
  try {
    const q = query(
      collection(db, "wallet_history"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(30)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { return []; }
}

// ── SAVINGS GOALS ──────────────────────────────────────────
export async function addSavingsGoal(userId, title, targetAmount, emoji = "🎯") {
  if (!title || !targetAmount) throw new Error("Title and target are required");
  return await addDoc(collection(db, "savings_goals"), {
    userId, title, targetAmount: parseFloat(targetAmount),
    saved: 0, emoji, completed: false, timestamp: serverTimestamp()
  });
}

export async function fetchSavingsGoals(userId) {
  try {
    const q = query(
      collection(db, "savings_goals"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { return []; }
}

export async function addToGoal(goalId, amount) {
  const ref  = doc(db, "savings_goals", goalId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Goal not found");
  const { saved, targetAmount } = snap.data();
  const newSaved = Math.min(saved + parseFloat(amount), targetAmount);
  await updateDoc(ref, { saved: newSaved, completed: newSaved >= targetAmount });
}

// ── MARKETPLACE ────────────────────────────────────────────
export async function listProduct(userId, sellerName, name, price, category, description, emoji = "🛍️") {
  return await addDoc(collection(db, "products"), {
    userId, sellerName, name, price: parseFloat(price),
    category, description, emoji, likes: 0, timestamp: serverTimestamp()
  });
}

export async function fetchProducts(categoryFilter = null) {
  try {
    let q;
    if (categoryFilter && categoryFilter !== "All") {
      q = query(
        collection(db, "products"),
        where("category", "==", categoryFilter),
        orderBy("timestamp", "desc"),
        limit(30)
      );
    } else {
      q = query(collection(db, "products"), orderBy("timestamp", "desc"), limit(30));
    }
    const snap = await getDocs(q);
    if (!snap.empty) return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { console.warn("products:", e.message); }
  return getDefaultProducts(categoryFilter);
}

export async function fetchMyProducts(userId) {
  try {
    const q = query(
      collection(db, "products"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { return []; }
}

export async function placeOrder(buyerId, productId, productName, price, sellerName) {
  return await addDoc(collection(db, "orders"), {
    buyerId, productId, productName, price, sellerName,
    status: "Confirmed", timestamp: serverTimestamp()
  });
}

export async function fetchMyOrders(buyerId) {
  try {
    const q = query(
      collection(db, "orders"),
      where("buyerId", "==", buyerId),
      orderBy("timestamp", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { return []; }
}

function getDefaultProducts(cat) {
  const all = [
    { id:"p1", name:"Handmade Silk Earrings",      price:350,  category:"Jewellery",  sellerName:"Priya Crafts",    emoji:"💎", description:"Handcrafted silk thread earrings",    likes:24 },
    { id:"p2", name:"Organic Turmeric Powder",      price:180,  category:"Food",       sellerName:"Meena Organics",  emoji:"🌿", description:"100% pure organic turmeric",         likes:41 },
    { id:"p3", name:"Hand-block Printed Dupatta",   price:850,  category:"Clothing",   sellerName:"Kavitha Textiles",emoji:"🧣", description:"Traditional block print dupatta",    likes:17 },
    { id:"p4", name:"Homemade Mango Pickle",        price:220,  category:"Food",       sellerName:"Lakshmi Foods",   emoji:"🥭", description:"Traditional mango pickle 500g",      likes:33 },
    { id:"p5", name:"Silver Anklet Pair",           price:1200, category:"Jewellery",  sellerName:"Devi Jewels",     emoji:"✨", description:"Pure silver anklets with bells",     likes:19 },
    { id:"p6", name:"Embroidered Potli Bag",        price:450,  category:"Accessories",sellerName:"Artisan Crafts",  emoji:"👜", description:"Hand-embroidered potli bag",         likes:28 },
  ];
  if (cat && cat !== "All") return all.filter(p => p.category === cat);
  return all;
}

// ── MENTORS ────────────────────────────────────────────────
export async function fetchMentors(category = null) {
  try {
    const snap = await getDocs(collection(db, "mentors"));
    if (!snap.empty) {
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (category && category !== "All") list = list.filter(m => m.category === category);
      return list;
    }
  } catch(e) { console.warn("mentors:", e.message); }
  return getDefaultMentors(category);
}

export async function becomeMentor(userId, name, category, bio, city) {
  return await addDoc(collection(db, "mentors"), {
    userId, name, category, bio, city,
    sales: 0, rating: 4.5, connects: 0, emoji: "👩", timestamp: serverTimestamp()
  });
}

export async function connectWithMentor(userId, mentorId, mentorName) {
  await addDoc(collection(db, "mentor_connects"), {
    userId, mentorId, mentorName, timestamp: serverTimestamp()
  });
  try {
    await updateDoc(doc(db, "mentors", mentorId), { connects: increment(1) });
  } catch(e) { /* mentor may be a default/non-Firestore mentor */ }
}

export async function fetchMyConnects(userId) {
  try {
    const q = query(
      collection(db, "mentor_connects"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { return []; }
}

function getDefaultMentors(category) {
  const all = [
    { id:"m1", name:"Priya",   category:"Jewellery",   bio:"10 years in handmade jewellery. Sold on Amazon & Meesho.",      city:"Coimbatore", sales:128, rating:4.9, emoji:"👩"   },
    { id:"m2", name:"Meena",   category:"Organic Foods",bio:"Started with ₹2000, now running a 5L/month food business.",    city:"Chennai",    sales:94,  rating:4.8, emoji:"👩‍🍳" },
    { id:"m3", name:"Kavitha", category:"Clothing",     bio:"Block print artist turned entrepreneur. 200+ orders/month.",   city:"Jaipur",     sales:210, rating:4.7, emoji:"👗"   },
    { id:"m4", name:"Lakshmi", category:"Food",         bio:"Home cook to cloud kitchen owner in 18 months.",               city:"Bengaluru",   sales:156, rating:4.9, emoji:"🍱"   },
    { id:"m5", name:"Divya",   category:"Accessories",  bio:"Potli bags to premium gifting — scaling handmade products.",   city:"Mumbai",     sales:89,  rating:4.6, emoji:"👜"   },
  ];
  if (category && category !== "All") return all.filter(m => m.category === category);
  return all;
}
