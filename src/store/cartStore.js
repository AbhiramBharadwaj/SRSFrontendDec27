import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (event, seatCount = 1, bookingType = 'user') => {
        console.log(event, seatCount, bookingType)
        const existingItem = get().items.find(item => 
          item.eventId === event._id && item.bookingType === bookingType
        );
        
        if (existingItem) {
          set({
            items: get().items.map(item =>
              item.eventId === event._id && item.bookingType === bookingType
                ? { ...item, seatCount: item.seatCount + seatCount }
                : item
            )
          });
        } else {
          set({
            items: [...get().items, {
              eventId: event._id,
              event,
              seatCount,
              bookingType,
              dateAdded: new Date().toISOString(),
            }]
          });
        }
      },
      
      removeItem: (eventId, bookingType) => {
        set({
          items: get().items.filter(item => 
            !(item.eventId === eventId && item.bookingType === bookingType)
          )
        });
      },
      
      updateItemCount: (eventId, bookingType, seatCount) => {
        if (seatCount <= 0) {
          get().removeItem(eventId, bookingType);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.eventId === eventId && item.bookingType === bookingType
              ? { ...item, seatCount }
              : item
          )
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.bookingType === 'member' 
            ? item.event.memberPrice 
            : item.bookingType === 'guest'
            ? item.event.guestPrice
            : item.event.userPrice;
          return total + (price * item.seatCount);
        }, 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.seatCount, 0);
      },
    }),
    {
      name: 'srs-cart-storage',
    }
  )
);

export default useCartStore;