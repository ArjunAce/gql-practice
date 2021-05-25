const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const agents = [
    { id: 'A007', name: 'Ramasundar', city: 'Bangalore' },
    { id: 'A003', name: 'Alex', city: 'London' },
    { id: 'A008', name: 'Alford', city: 'New York' },
    { id: 'A011', name: 'Ravi Kumar', city: 'Bangalore' },
    { id: 'A010', name: 'Santakumar', city: 'Chennai' },
    { id: 'A012', name: 'Lucida', city: 'San Jose' },
    { id: 'A005', name: 'Anderson', city: 'Brisban' },
    { id: 'A001', name: 'Subbarao', city: 'Bangalore' },
    { id: 'A002', name: 'Mukesh', city: 'Mumbai' },
    { id: 'A006', name: 'McDen', city: 'London' },
    { id: 'A004', name: 'Ivan', city: 'Torento' },
    { id: 'A009', name: 'Benjamin', city: 'Hampshair' }
];
const customers = [
    { id: 'C00013', name: 'Holmes', city: 'London', agentId: 'A003' },
    { id: 'C00001', name: 'Micheal', city: 'New York', agentId: 'A008' },
    { id: 'C00020', name: 'Albert', city: 'New York', agentId: 'A008' },
    { id: 'C00025', name: 'Ravindran', city: 'Bangalore', agentId: 'A011' },
    { id: 'C00024', name: 'Cook', city: 'London', agentId: 'A006' },
    { id: 'C00015', name: 'Stuart', city: 'London', agentId: 'A003' },
    { id: 'C00002', name: 'Bolt', city: 'New York', agentId: 'A008' },
    { id: 'C00018', name: 'Fleming', city: 'Brisban', agentId: 'A005' },
    { id: 'C00021', name: 'Jacks', city: 'Brisban', agentId: 'A005' },
    { id: 'C00019', name: 'Yearannaidu', city: 'Chennai', agentId: 'A010' },
    { id: 'C00005', name: 'Sasikant', city: 'Mumbai', agentId: 'A002' },
    { id: 'C00007', name: 'Ramanathan', city: 'Chennai', agentId: 'A010' },
    { id: 'C00022', name: 'Avinash', city: 'Mumbai', agentId: 'A002' },
    { id: 'C00004', name: 'Winston', city: 'Brisban', agentId: 'A005' },
    { id: 'C00023', name: 'Karl', city: 'London', agentId: 'A006' },
    { id: 'C00006', name: 'Shilton', city: 'Torento', agentId: 'A004' },
    { id: 'C00010', name: 'Charles', city: 'Hampshair', agentId: 'A009' },
    { id: 'C00017', name: 'Srinivas', city: 'Bangalore', agentId: 'A007' },
    { id: 'C00012', name: 'Steven', city: 'San Jose', agentId: 'A012' },
    { id: 'C00008', name: 'Karolina', city: 'Torento', agentId: 'A004' },
    { id: 'C00003', name: 'Martin', city: 'Torento', agentId: 'A004' },
    { id: 'C00009', name: 'Ramesh', city: 'Mumbai', agentId: 'A002' },
    { id: 'C00014', name: 'Rangarappa', city: 'Bangalore', agentId: 'A001' },
    { id: 'C00016', name: 'Venkatpati', city: 'Bangalore', agentId: 'A007' },
    { id: 'C00011', name: 'Sundariya', city: 'Chennai', agentId: 'A010' }
];

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root query.',
    fields: () => ({
        agents: {
            type: new GraphQLList(AgentType),
            description: 'This is a list of agents',
            resolve: () => agents
        },
        agent: {
            type: AgentType,
            description: 'A single agent',
            args: {
                agentId: { type: GraphQLString }
            },
            resolve: (parent, { agentId: id }) => {
                return agents.find(agent => agent.id === id);
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            description: 'This is a list of customers',
            resolve: () => customers
        },
        customer: {
            type: CustomerType,
            description: 'A single customer',
            args: {
                customerId: { type: GraphQLString }
            },
            resolve: (parent, { customerId: id }) => {
                return customers.find(customer => customer.id === id);
            }
        }
    })
});

const AgentType = new GraphQLObjectType({
    name: 'Agent',
    description: 'This is an agent.',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        city: { type: GraphQLNonNull(GraphQLString) },
        customers: {
            type: new GraphQLList(CustomerType),
            description: 'The list of customers this agent is dealing with.',
            resolve: ({ id }) => {
                return customers.filter(({ agentId }) => agentId === id);
            }
        }
    })
});

const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        city: { type: GraphQLNonNull(GraphQLString) },
        agentId: { type: GraphQLNonNull(GraphQLString) },
        agent: {
            type: AgentType,
            description: 'The agent who is dealing with this customer.',
            resolve: ({ agentId }) => {
                return agents.find(({ id }) => id === agentId);
            }
        }
    })
});


const schema = new GraphQLSchema({
    query: RootQueryType
});

const graphqlServer = graphqlHTTP({
    schema,
    graphiql: true
});

module.exports = { graphqlServer };