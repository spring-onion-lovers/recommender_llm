interface UserActions {
  purchases: Set<number>;
  shares: Set<number>;
  views: Set<number>;
  carts: Set<number>;
}

export const parseUserActions = (input: any[]): Map<number, UserActions> => {
  const userActions = new Map<number, UserActions>();

  input.map((str) => {
    const [userId, action, productId] = str.split(' ');
    const parsedUserId = parseInt(userId);
    const parsedProductId = parseInt(productId);
    if (!userActions.has(parsedUserId)) {
      userActions.set(parsedUserId, { purchases: new Set(), views: new Set(), shares: new Set(), carts: new Set() });
    }

    const actions = userActions.get(parsedUserId)!;
    if (action === 'purchase') {
      actions.purchases.add(parsedProductId);
    } else if (action === 'view') {
      actions.views.add(parsedProductId);
    } else if (action === 'share') {
      actions.shares.add(parsedProductId);
    } else if(action === 'add_to_cart'){
      actions.carts.add(parsedProductId);
    }
  });

  return userActions;
};


export const identifyRecommendations = (userId:number, userActions: Map<number, UserActions>) => {
  const userViews = userActions.get(userId)!.views;

  const userPurchases = userActions.get(userId)!.purchases;
//   const userShares = userActions.get(userId)!.shares;
  const userCarts = userActions.get(userId)!.carts;

  const recommendations = new Set<number>();

  userActions.forEach((actions,otherUserId) =>{
    if(otherUserId !== userId){
        actions.purchases.forEach(productId => {
            if(!userViews.has(productId) && !userPurchases.has(productId) && !userCarts.has(productId)) {
                recommendations.add(productId);
            }
        });
    }
  });

  return [...recommendations];

}   