const Token = artifacts.require("ReflectionToken");
const Router = artifacts.require("IUniswapV2Router02");
const currTime = Number(Math.round(new Date().getTime() / 1000));

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Token);

  let tokenInstance = await Token.deployed();

  await addLiq(tokenInstance, accounts[0]);

};

const addLiq = async (tokenInstance, account) => {

  const routerInstance = await Router.at(
    "0x10ED43C718714eb63d5aA57B78B54704E256024E"
  );
  
  let supply = await tokenInstance.totalSupply();
  await tokenInstance.approve(routerInstance.address, BigInt(supply), {
    from: account,
  });

  await routerInstance.addLiquidityETH(
    tokenInstance.address,
    BigInt(supply / 2),
    0,
    0,
    routerInstance.address,
    currTime + 100,
    { value: 1e16, from: account }
  );

}
