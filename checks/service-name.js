const path = require('path');

const validCharacters = RegExp('^[a-z][a-z0-9\-]*');

/**
 * Accepts an orders object, and validates the name of the service
 * @param {{path: string, contents: Array<string>}} orders 
 */
async function validateServiceName(orders) {
  const serviceName = path.dirname(orders.path);

  const problems = [];

  if (serviceName.length > 28) {
    problems.push(`**${serviceName}** - Name of service cannot exceed 28 characters.`);
  }

  if (!validCharacters.test(serviceName)) {
    problems.push(`**${serviceName}** - Service name must only contain lowercase alphanumeric characters and hyphens.`);
  }

  if (serviceName.includes('--')) {
    problems.push(`**${serviceName}** - Service name cannot include "--".`);
  }

  return [{
    title: 'Invalid Service Name',
    problems,
    line: 0
  }]
}

module.exports = validateServiceName;