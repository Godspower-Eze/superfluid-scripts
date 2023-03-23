import { Account, Contract, ec, Provider } from "starknet";

import * as SuperTokenContract from "./abis/SuperToken.json";
import * as PoolContract from "./abis/Pool.json";
import { DEVNET, PRIVATE_KEY, ACCOUNT_ADDRESS } from "./constants";

class SuperToken {
  contract: any;
  provider: any;

  constructor(baseUrl: string, contractAddress: string) {
    this.provider = new Provider({ sequencer: { baseUrl: baseUrl } });
    this.contract = new Contract(
      SuperTokenContract.abi,
      contractAddress,
      this.provider
    );
  }

  // View Functions
  async decimals() {
    let decimals = await this.contract.decimals();
    decimals = decimals.decimals.toNumber();
    return decimals;
  }

  async balance(account: string) {
    let balance = await this.contract.balanceOf(account);
    balance = balance.balance.toNumber();
    console.log(balance);
    return balance;
  }

  async getNetFlowRate(account: string) {
    const netFlowRate = await this.contract.getNetFlowRate(account);
    const flowRate = netFlowRate.flow_rate.toNumber();
    return flowRate;
  }

  async getFlowRate(from: string, to: string, flowId: number) {
    const flowRate = await this.contract.getFlowRate(from, to, flowId);
    const _flowRate = flowRate.flow_rate.toNumber();
    return _flowRate;
  }

  async isMemberConnected(poolAddress: string, account: string) {
    let connected = await this.contract.isMemberConnected(poolAddress, account);
    connected = connected.success.toNumber();
    const success = connected == 1 ? true : false;
    console.log(success);
    return success;
  }

  async getNumConnections(account: string) {
    let count = await this.contract.getNumConnections(account);
    count = count.value.toNumber();
    return count;
  }

  // External Funtions

  async approve(account: Account, spender: string, amount: number) {
    this.contract.connect(account);
    const response = await this.contract.approve(spender, amount);
    return response;
  }

  async increaseAllowance(
    account: Account,
    spender: string,
    added_value: number
  ) {
    this.contract.connect(account);
    const response = await this.contract.increase_allowance(
      spender,
      added_value
    );
    return response;
  }

  async decreaseAllowance(
    account: Account,
    spender: string,
    subtracted_value: number
  ) {
    this.contract.connect(account);
    const response = await this.contract.decrease_allowance(
      spender,
      subtracted_value
    );
    return response;
  }

  async mint(account: Account, recipient: string, amount: number) {
    this.contract.connect(account);
    const response = await this.contract.mint(recipient, amount);
    return response;
  }

  async transfer(account: Account, recipient: string, amount: number) {
    this.contract.connect(account);
    const response = await this.contract.transfer(recipient, amount);
    return response;
  }

  async transferFrom(
    account: Account,
    sender: string,
    recipient: string,
    amount: number
  ) {
    this.contract.connect(account);
    const response = await this.contract.transferFrom(
      sender,
      recipient,
      amount
    );
    return response;
  }

  async shift(
    account: Account,
    sender: string,
    recipient: string,
    amount: number
  ) {
    this.contract.connect(account);
    const response = await this.contract.shift(sender, recipient, amount);
    return response;
  }

  async createFlow(
    account: Account,
    sender: string,
    recipient: string,
    flowId: number,
    flow_rate: number
  ) {
    this.contract.connect(account);
    const response = await this.contract.flow(
      sender,
      recipient,
      flowId,
      flow_rate
    );
    return response;
  }

  async deleteFlow(
    account: Account,
    sender: string,
    recipient: string,
    flowId: number
  ) {
    this.contract.connect(account);
    const response = await this.contract.flow(sender, recipient, flowId, 0);
    return response;
  }

  async createPool(account: Account) {
    this.contract.connect(account);
    const response = await this.contract.createPool();
    // const txReceipt = await this.provider.waitForTransaction(
    //   response.transaction_hash
    // );
    return response;
  }

  async distribute(
    account: Account,
    sender: string,
    poolAddress: string,
    amount: number
  ) {
    this.contract.connect(account);
    const response = await this.contract.distribute(
      sender,
      poolAddress,
      amount
    );
    return response;
  }

  async connectPool(account: Account, poolAddress: string) {
    this.contract.connect(account);
    const response = await this.contract.connectPool(poolAddress);
    return response;
  }

  async disconnectPool(account: Account, poolAddress: string) {
    this.contract.connect(account);
    const response = await this.contract.disconnectPool(poolAddress);
    return response;
  }
}

class Pool {
  contract: any;
  provider: any;

  constructor(baseUrl: string, contractAddress: string) {
    this.provider = new Provider({ sequencer: { baseUrl: baseUrl } });
    this.contract = new Contract(
      SuperTokenContract.abi,
      contractAddress,
      this.provider
    );
  }

  async getPendingUnits() {
    let units = await this.contract.getPendingUnits();
    units = units.value.toNumber();
    return units;
  }

  async getTotalUnits() {
    let units = await this.contract.getTotalUnits();
    units = units.value.toNumber();
    return units;
  }

  // External Funtions

  async updateMember(account: Account, member: string, unit: number) {
    this.contract.connect(account);
    const response = await this.contract.updateMember(member, unit);
    return response;
  }
}

const superToken = new SuperToken(DEVNET, "");
superToken.balance(ACCOUNT_ADDRESS);

// superToken.isMemberConnected(
//   "0x06Fe82a56a78Dc43E591d00ed0855C264A53A38E918F3a540E0BEC9f41faed45",
//   "0x06Fe82a56a78Dc43E591d00ed0855C264A53A38E918F3a540E0BEC9f41faed45"
// );

// Account
const starkKeyPair1 = ec.getKeyPair(PRIVATE_KEY);

const account1 = new Account(
  superToken.provider,
  ACCOUNT_ADDRESS,
  starkKeyPair1
);

// superToken.flow(
//   account1,
//   ACCOUNT_ADDRESS,
//   "0x06Fe82a56a78Dc43E591d00ed0855C264A53A38E918F3a540E0BEC9f41faed45",
//   0,
//   0
// );

// superToken.distribute(
//   account1,
//   ACCOUNT_ADDRESS,
//   "0x06Fe82a56a78Dc43E591d00ed0855C264A53A38E918F3a540E0BEC9f41faed45",
//   100
// );

// superToken.createPool(account1);

// superToken.balance(ACCOUNT_ADDRESS);

// superToken.balance(
//   "0x06Fe82a56a78Dc43E591d00ed0855C264A53A38E918F3a540E0BEC9f41faed45"
// );
